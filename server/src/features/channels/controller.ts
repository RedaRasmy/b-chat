import { channelService } from "@/features/channels/service"
import { emitToUsers } from "@/socket"
import { makeEndpoint } from "@/utils/make-endpoint"
import {
    IdParam,
    InsertDMSchema,
    InsertGroupSchema,
    UpdateGroupSchema,
} from "@bchat/shared/validation"
import { Channels, ChatMember } from "@bchat/types"

export const createDM = makeEndpoint(
    {
        body: InsertDMSchema,
    },
    async (req, res, next) => {
        const userId = req.user!.id
        const { friendId } = req.body

        try {
            const { channel, dm } = await channelService.createDM(
                userId,
                friendId,
            )

            emitToUsers([userId, friendId], "new_chat", channel)

            res.status(201).json(dm)
        } catch (err) {
            next(err)
        }
    },
)

export const createGroup = makeEndpoint(
    {
        body: InsertGroupSchema,
    },
    async (req, res, next) => {
        const userId = req.user!.id
        const { name, members } = req.body

        try {
            const { group, validMembers, channel } =
                await channelService.createGroup({
                    name,
                    membersIds: members,
                    userId,
                })

            emitToUsers(validMembers, "new_chat", channel)

            res.status(201).json(group)
        } catch (err) {
            next(err)
        }
    },
)

export const getChannels = makeEndpoint(async (req, res, next) => {
    const { id: userId } = req.user!

    try {
        const channels = await channelService.getUserChannels(userId)

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

export const getMessages = makeEndpoint(
    {
        params: IdParam,
    },
    async (req, res, next) => {
        const channelId = req.params.id
        const user = req.user!

        try {
            const messages = await channelService.getChannelMessages(
                channelId,
                user.id,
            )

            res.json(messages)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteChannel = makeEndpoint(
    {
        params: IdParam,
    },
    async (req, res, next) => {
        const channelId = req.params.id
        const user = req.user!

        try {
            await channelService.deleteChannel(channelId, user.id)

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const updateGroup = makeEndpoint(
    {
        body: UpdateGroupSchema,
        params: IdParam,
    },
    async (req, res, next) => {
        const channelId = req.params.id
        const userId = req.user!.id
        const { name } = req.body

        try {
            await channelService.updateGroup({
                channelId,
                userId,
                name,
            })

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
