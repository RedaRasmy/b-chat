import { emitToChannel, getUserSocket } from "@/socket"
import { makeEndpoint } from "@/utils/make-endpoint"
import db from "@bchat/database"
import { IMember, members } from "@bchat/database/tables"
import {
    InsertMembersSchema,
    UpdateMemberSchema,
} from "@bchat/shared/validation"
import { and, eq, inArray } from "drizzle-orm"
import z from "zod"

export const addMembers = makeEndpoint(
    {
        params: z.object({
            channelId: z.uuid(),
        }),
        body: InsertMembersSchema,
    },
    async (req, res, next) => {
        const user = req.user!
        const channelId = req.params.channelId
        const data = req.body
        try {
            const channel = await db.query.channels.findFirst({
                where: (channels, { eq }) => eq(channels.id, channelId),
                with: {
                    members: {
                        columns: {
                            userId: true,
                            role: true,
                            status: true,
                        },
                    },
                },
            })

            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }

            const member = channel.members.find(
                (member) => member.userId === user.id,
            )

            if (
                !member ||
                member.role === "member" ||
                channel.type !== "group"
            ) {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }
            const existingMemberIds = new Set(
                channel.members.map((m) => m.userId),
            )
            const oldMembers = channel.members
                .filter(
                    (mem) =>
                        data.includes(mem.userId) && mem.status === "removed",
                )
                .map((m) => m.userId)
            const newMembers = data.filter((id) => !existingMemberIds.has(id))

            if (newMembers.length > 0) {
                const values: IMember[] = newMembers.map((id) => ({
                    channelId,
                    userId: id,
                }))
                await db.insert(members).values(values)
            }

            if (oldMembers.length > 0) {
                await db
                    .update(members)
                    .set({
                        status: "active",
                    })
                    .where(
                        and(
                            eq(members.channelId, channelId),
                            inArray(members.userId, oldMembers),
                        ),
                    )
            }

            emitToChannel(channelId, "new_members")

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const updateMember = makeEndpoint(
    {
        params: z.object({
            channelId: z.uuid(),
            userId: z.uuid(),
        }),
        body: UpdateMemberSchema,
    },
    async (req, res, next) => {
        const user = req.user!
        const { channelId, userId } = req.params
        const { role } = req.body
        try {
            const channel = await db.query.channels.findFirst({
                where: (channels, { eq }) => eq(channels.id, channelId),
                with: {
                    members: {
                        columns: {
                            userId: true,
                            role: true,
                        },
                        where: (members, { eq }) =>
                            eq(members.status, "active"),
                        with: {
                            user: {
                                columns: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            })

            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }

            const member = channel.members.find(
                (member) => member.userId === user.id,
            )
            const targetMember = channel.members.find(
                (member) => member.userId === userId,
            )

            if (!targetMember) {
                return res.status(404).json({
                    message: "Member not found",
                })
            }

            if (
                !member ||
                member.role !== "owner" ||
                channel.type !== "group"
            ) {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            await db
                .update(members)
                .set({
                    role,
                })
                .where(
                    and(
                        eq(members.channelId, channelId),
                        eq(members.userId, userId),
                    ),
                )

            emitToChannel(channelId, "role_changed", {
                userId: targetMember.userId,
                userName: targetMember.user.name,
                oldRole: targetMember.role,
                newRole: role,
            })

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteMember = makeEndpoint(
    {
        params: z.object({
            channelId: z.uuid(),
            userId: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const { channelId, userId } = req.params
        const user = req.user!
        try {
            const channel = await db.query.channels.findFirst({
                where: (chs, { eq }) => eq(chs.id, channelId),
                with: {
                    members: {
                        with: {
                            user: {
                                columns: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            })

            if (!channel || channel.type === "dm") {
                return res.status(404).json({
                    message: "Group not found",
                })
            }
            const member = channel.members.find((mem) => mem.userId === user.id)
            const targetMember = channel.members.find(
                (mem) => mem.userId === userId,
            )

            if (!targetMember || targetMember.status !== "active") {
                return res.status(404).json({
                    message: "Member not found",
                })
            }

            if (
                !member ||
                member.role === "member" ||
                (member.role === "admin" && targetMember.role === "admin") ||
                targetMember.role === "owner"
            ) {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            await db
                .update(members)
                .set({
                    status: "removed",
                })
                .where(
                    and(
                        eq(members.channelId, channelId),
                        eq(members.userId, userId),
                    ),
                )

            emitToChannel(channelId, "member_deleted", {
                userId: targetMember.userId,
                userName: targetMember.user.name,
            })

            const socket = getUserSocket(userId)

            if (socket) {
                socket.leave(`channel:${channelId}`)
            }

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const exitChannel = makeEndpoint(
    {
        params: z.object({
            channelId: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const { channelId } = req.params
        const user = req.user!
        try {
            const channel = await db.query.channels.findFirst({
                where: (chs, { eq, and }) =>
                    and(eq(chs.id, channelId), eq(chs.type, "group")),
                with: {
                    members: {
                        with: {
                            user: {
                                columns: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            })
            if (!channel) {
                return res.status(404).json({
                    message: "Group not found",
                })
            }
            const member = channel.members.find((mem) => mem.userId === user.id)

            if (!member) {
                return res.status(400).json({
                    message: "You are not a group member",
                })
            }

            if (member.role === "owner") {
                return res.status(403).json({
                    message: "Group owner can't exit the group",
                })
            }

            await db
                .update(members)
                .set({
                    status: "removed",
                })
                .where(
                    and(
                        eq(members.channelId, channelId),
                        eq(members.userId, user.id),
                    ),
                )

            const socket = getUserSocket(user.id)

            if (socket) {
                socket.leave(`channel:${channelId}`)
            }

            emitToChannel(channelId, "member_left", {
                userId: member.userId,
                userName: member.user.name,
            })

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
