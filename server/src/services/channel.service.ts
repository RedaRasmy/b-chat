import db from "@bchat/database"

export class ChannelService {
    async getUserChannels(userId: string) {
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
