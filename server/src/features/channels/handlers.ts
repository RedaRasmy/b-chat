import { getFriendsIds } from "@/queries/get-friends"
import { getUserSocket } from "@/server"
import {
    makeBodyEndpoint,
    makeIdBodyEndpoint,
    makeParamsEndpoint,
    makeSimpleEndpoint,
} from "@/utils/wrappers"
import db from "@bchat/database"
import {
    channels,
    dms,
    groups,
    IMember,
    members,
    messages,
} from "@bchat/database/tables"
import {
    InsertDMSchema,
    InsertGroupSchema,
    UpdateGroupSchema,
} from "@bchat/shared/validation"
import { Channels, ChatMember, ChatMessage, OtherUser } from "@bchat/types"
import { asc, desc, eq } from "drizzle-orm"

export const createDM = makeBodyEndpoint(
    InsertDMSchema,
    async (req, res, next) => {
        const userId = req.user!.id
        const { friendId } = req.body

        try {
            const friendsIds = await getFriendsIds(userId)
            if (!friendsIds.includes(friendId)) {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            await db.transaction(async (tx) => {
                const [channel] = await tx
                    .insert(channels)
                    .values({
                        type: "dm",
                    })
                    .returning()

                const [dm] = await tx
                    .insert(dms)
                    .values({
                        channelId: channel.id,
                        user1Id: userId,
                        user2Id: friendId,
                    })
                    .returning()

                await tx.insert(members).values([
                    { channelId: channel.id, userId: userId },
                    { channelId: channel.id, userId: friendId },
                ])

                const creatorSocket = getUserSocket(userId)
                const friendSocket = getUserSocket(friendId)

                if (creatorSocket) {
                    creatorSocket.join(`channel:${channel.id}`)
                }

                if (friendSocket) {
                    friendSocket.join(`channel:${channel.id}`)
                }

                res.status(201).json(dm)
            })
        } catch (err) {
            next(err)
        }
    },
)

export const createGroup = makeBodyEndpoint(
    InsertGroupSchema,
    async (req, res, next) => {
        const userId = req.user!.id
        const { name, members: unsafeMembers } = req.body

        try {
            const friends = await getFriendsIds(userId)

            const validMembers = unsafeMembers.filter((id) =>
                friends.includes(id),
            )

            validMembers.push(userId)

            await db.transaction(async (tx) => {
                const [channel] = await tx
                    .insert(channels)
                    .values({
                        type: "group",
                    })
                    .returning()

                const [group] = await tx
                    .insert(groups)
                    .values({
                        channelId: channel.id,
                        name,
                    })
                    .returning()

                await tx.insert(members).values(
                    validMembers.map(
                        (memberId): IMember => ({
                            channelId: channel.id,
                            userId: memberId,
                            role: memberId === userId ? "owner" : "member",
                        }),
                    ),
                )

                const creatorSocket = getUserSocket(userId)
                if (creatorSocket) {
                    creatorSocket.join(`channel:${channel.id}`)
                }
                validMembers.forEach((memberId) => {
                    const memberSocket = getUserSocket(memberId)
                    if (memberSocket) {
                        memberSocket.join(`channel:${channel.id}`)
                    }
                })

                res.status(201).json(group)
            })
        } catch (err) {
            next(err)
        }
    },
)

export const getChannels = makeSimpleEndpoint(async (req, res, next) => {
    const { id: userId } = req.user!

    try {
        const channels = await db.query.members.findMany({
            where: (members, { eq }) => eq(members.userId, userId),
            columns: {},
            with: {
                channel: {
                    with: {
                        members: {
                            with: {
                                user: {
                                    columns: {
                                        id: true,
                                        name: true,
                                        avatar: true,
                                        role: true,
                                        status: true,
                                        lastSeen: true,
                                    },
                                },
                            },
                        },
                        messages: {
                            orderBy: desc(messages.createdAt),
                            with: {
                                receipts: {
                                    where: (rec, { eq, and }) =>
                                        and(eq(rec.userId, userId)),
                                },
                            },
                            limit: 1,
                        },
                        group: true,
                    },
                },
            },
        })

        const finalData: Channels = channels.map(({ channel }) => {
            const lastMessage = channel.messages[0] ?? null
            const members = channel.members.map(
                ({ user: u, joinedAt, role, status }): ChatMember => ({
                    id: u.id,
                    name: u.name,
                    role: u.role,
                    avatar: u.avatar,
                    joinedAt,
                    chatRole: role,
                    status,
                }),
            )
            if (channel.type === "dm") {
                const { user: friend } = channel.members.find(
                    (m) => m.userId !== userId,
                )!
                return {
                    id: channel.id,
                    type: "dm",
                    lastMessage,
                    members,
                    name: null,
                    avatar: null,
                    status: friend.status,
                    lastSeen: friend.lastSeen,
                }
            } else {
                return {
                    id: channel.id,
                    type: "group",
                    lastMessage,
                    members,
                    name: channel.group.name,
                    avatar: channel.group.avatar,
                }
            }
        })

        res.json(finalData)
    } catch (err) {
        next(err)
    }
})

export const getMessages = makeParamsEndpoint(
    ["id"],
    async (req, res, next) => {
        const id = req.params.id
        const user = req.user!

        try {
            const member = await db.query.members.findFirst({
                where: (members, { eq, and }) =>
                    and(eq(members.channelId, id), eq(members.userId, user.id)),
                with: {
                    channel: {
                        with: {
                            messages: {
                                orderBy: asc(messages.createdAt),
                                with: {
                                    receipts: true,
                                },
                            },
                        },
                    },
                },
            })

            if (!member) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }

            const data: ChatMessage[] = member.channel.messages

            res.json(data)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteChannel = makeParamsEndpoint(
    ["id"],
    async (req, res, next) => {
        const id = req.params.id
        const user = req.user!

        try {
            const channel = await db.query.channels.findFirst({
                where: (channels, { eq }) => eq(channels.id, id),
                with: {
                    members: true,
                },
            })
            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }
            const member = channel.members.find((mem) => mem.userId === user.id)

            if (!member) {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            const isOwner = member.role === "owner"

            if (!isOwner && channel.type === "group") {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            // delete if the user is a : DM member OR Group owner

            await db.delete(channels).where(eq(channels.id, id))

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const updateGroup = makeIdBodyEndpoint(
    UpdateGroupSchema,
    async (req, res, next) => {
        const id = req.params.id
        const user = req.user!
        const { name } = req.body

        try {
            const channel = await db.query.channels.findFirst({
                where: (channels, { eq }) => eq(channels.id, id),
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

            const member = channel.members.find((mem) => mem.userId === user.id)

            if (!member || member.role !== "owner" || channel.type === "dm") {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            await db
                .update(groups)
                .set({
                    name,
                })
                .where(eq(groups.channelId, id))

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
