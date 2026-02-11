import { getFriendsIds } from "@/queries/get-friends"
import { getUserSocket } from "@/server"
import {
    makeBodyEndpoint,
    makeParamsEndpoint,
    makeSimpleEndpoint,
} from "@/utils/wrappers"
import db from "@bchat/database"
import {
    channels,
    dms,
    groups,
    members,
    messages,
} from "@bchat/database/tables"
import { InsertDMSchema, InsertGroupSchema } from "@bchat/shared/validation"
import { Channels, ChatMessage } from "@bchat/types"
import { asc, desc } from "drizzle-orm"

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
                    validMembers.map((memberId) => ({
                        channelId: channel.id,
                        userId: memberId,
                    })),
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
            if (channel.type === "dm") {
                return {
                    id: channel.id,
                    type: "dm",
                    lastMessage,
                    members: channel.members.map((mem) => mem.user),
                    name: null,
                    avatar: null,
                }
            } else {
                return {
                    id: channel.id,
                    type: "group",
                    lastMessage,
                    members: channel.members.map((mem) => mem.user),
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
