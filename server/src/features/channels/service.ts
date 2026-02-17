import { ForbiddenError, NotFoundError } from "@/errors"
import { getFriendsIds } from "@/queries/get-friends"
import db from "@bchat/database"
import {
    channels,
    dms,
    groups,
    IMember,
    members,
    messages,
} from "@bchat/database/tables"
import { asc, desc, eq } from "drizzle-orm"

export class ChannelService {
    async updateGroup({
        channelId,
        userId,
        name,
    }: {
        channelId: string
        userId: string
        name: string
    }) {
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
            throw new NotFoundError("Channel not found")
        }

        const member = channel.members.find((mem) => mem.userId === userId)

        if (!member || member.role !== "owner" || channel.type === "dm") {
            throw new ForbiddenError("Action not allowed")
        }

        await db
            .update(groups)
            .set({
                name,
            })
            .where(eq(groups.channelId, channelId))
    }

    async deleteChannel(channelId: string, userId: string) {
        const channel = await db.query.channels.findFirst({
            where: (channels, { eq }) => eq(channels.id, channelId),
            with: {
                members: true,
            },
        })
        if (!channel) {
            throw new NotFoundError("Channel not found")
        }
        const member = channel.members.find((mem) => mem.userId === userId)

        if (!member) {
            throw new ForbiddenError("You are not a member")
        }

        const isOwner = member.role === "owner"

        if (!isOwner && channel.type === "group") {
            throw new ForbiddenError("Action not allowed")
        }

        await db.delete(channels).where(eq(channels.id, channelId))
    }

    async getChannelMessages(channelId: string, userId: string) {
        const member = await db.query.members.findFirst({
            where: (members, { eq, and }) =>
                and(
                    eq(members.channelId, channelId),
                    eq(members.userId, userId),
                ),
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
        if (!member) throw new NotFoundError("Channel not found")

        return member.channel.messages
    }
    async createDM(userId: string, friendId: string) {
        const friendsIds = await getFriendsIds(userId)
        if (!friendsIds.includes(friendId)) {
            throw new ForbiddenError("You are not friends")
        }

        return await db.transaction(async (tx) => {
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

            return dm
        })
    }

    async createGroup({
        name,
        membersIds,
        userId,
    }: {
        name: string
        membersIds: string[]
        userId: string
    }) {
        const friends = await getFriendsIds(userId)

        const validMembers = membersIds.filter((id) => friends.includes(id))

        validMembers.push(userId)

        return await db.transaction(async (tx) => {
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
            return {
                ...group,
                members: validMembers,
            }
        })
    }

    async getUserChannels(userId: string) {
        return await db.query.members.findMany({
            where: (members, { eq, and }) =>
                and(eq(members.userId, userId), eq(members.status, "active")),
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
    }

    async getUserChannelsIds(userId: string) {
        return await db.query.members.findMany({
            where: (members, { eq, and }) =>
                and(eq(members.userId, userId), eq(members.status, "active")),
            columns: { channelId: true },
        })
    }

    async getChannelWithMembers(channelId: string) {
        return await db.query.channels.findFirst({
            where: (channels, { eq }) => eq(channels.id, channelId),
            with: {
                members: {
                    where: (members, { eq }) => eq(members.status, "active"),
                },
            },
        })
    }

    async verifyUserInChannel(channelId: string, userId: string) {
        return await db.query.members.findFirst({
            where: (members, { eq, and }) =>
                and(
                    eq(members.channelId, channelId),
                    eq(members.userId, userId),
                    eq(members.status, "active"),
                ),
            columns: { channelId: true },
        })
    }
}

export const channelService = new ChannelService()
