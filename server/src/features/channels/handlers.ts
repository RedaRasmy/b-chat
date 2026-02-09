import { getUserSocket } from "@/server"
import {
    makeBodyEndpoint,
    makeParamsEndpoint,
    makeSimpleEndpoint,
} from "@/utils/wrappers"
import db from "@bchat/database"
import { channels, dms, members, messages } from "@bchat/database/tables"
import { InsertDMSchema } from "@bchat/shared/validation"
import { Channels, OtherUser } from "@bchat/types"
import { desc } from "drizzle-orm"

export const createDM = makeBodyEndpoint(
    InsertDMSchema,
    async (req, res, next) => {
        const userId = req.user!.id
        const { friendId } = req.body

        try {
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

export const getChannels = makeSimpleEndpoint(async (req, res, next) => {
    const { id: userId } = req.user!

    try {
        const channels = await db.query.members.findMany({
            where: (members, { eq }) => eq(members.userId, userId),
            columns: {
                channelId: true,
            },
            with: {
                channel: {
                    with: {
                        members: {
                            where: (members, { ne }) =>
                                ne(members.userId, userId),
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
                            limit: 1,
                        },
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
                    friend: channel.members[0].user,
                }
            } else {
                return {
                    // TODO: add group name (groups table)
                    id: channel.id,
                    type: "group",
                    lastMessage,
                    members: channel.members.map(
                        ({ user }): OtherUser => ({
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            role: user.role,
                        }),
                    ),
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
            const userChannel = await db.query.dms.findFirst({
                where: (dms, { eq, and, or }) =>
                    and(
                        eq(dms.channelId, id),
                        or(eq(dms.user1Id, user.id), eq(dms.user2Id, user.id)),
                    ),
            })
            if (!userChannel) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }
            const messages = await db.query.messages.findMany({
                where: (msgs, { eq }) => eq(msgs.channelId, id),
            })

            res.json(messages)
        } catch (err) {
            next(err)
        }
    },
)
