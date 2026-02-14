import { io } from "@/server"
import { makeParamsBodyEndpoint, makeParamsEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { IMember, members } from "@bchat/database/tables"
import {
    InsertMembersSchema,
    UpdateMemberSchema,
} from "@bchat/shared/validation"
import { and, eq } from "drizzle-orm"

export const addMembers = makeParamsBodyEndpoint(
    ["channelId"],
    InsertMembersSchema,
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
                (member) => (member.userId = user.id),
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

            const memberIds = channel.members.map((mem) => mem.userId)

            const values: IMember[] = data
                .filter((id) => !memberIds.includes(id))
                .map((id) => ({
                    channelId,
                    userId: id,
                }))

            await db.insert(members).values(values)

            io.to(`channel:${channelId}`).emit("new_members")

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const updateMember = makeParamsBodyEndpoint(
    ["channelId", "userId"],
    UpdateMemberSchema,
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
                    },
                },
            })

            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }

            const member = channel.members.find(
                (member) => (member.userId = user.id),
            )

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

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteMember = makeParamsEndpoint(
    ["channelId", "userId"],
    async (req, res, next) => {
        const { channelId, userId } = req.params
        const user = req.user!
        try {
            const [m1, m2] = await db.query.members.findMany({
                where: (members, { eq, and, or }) =>
                    and(
                        eq(members.channelId, channelId),
                        or(
                            eq(members.userId, user.id),
                            eq(members.userId, userId),
                        ),
                    ),
            })

            if (!m1 || !m2) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }
            const member = m1.userId === user.id ? m1 : m2
            const targetMember = m1.userId === userId ? m1 : m2

            if (
                member.role === "member" ||
                targetMember.role === "owner" ||
                (member.role === "admin" && targetMember.role === "admin")
            ) {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            await db
                .delete(members)
                .where(
                    and(
                        eq(members.channelId, channelId),
                        eq(members.userId, userId),
                    ),
                )

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const exitChannel = makeParamsEndpoint(
    ["channelId"],
    async (req, res, next) => {
        const { channelId } = req.params
        const user = req.user!
        try {
            await db
                .delete(members)
                .where(
                    and(
                        eq(members.channelId, channelId),
                        eq(members.userId, user.id),
                    ),
                )

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
