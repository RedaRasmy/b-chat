import { channelService } from "@/features/channels/service"
import logger from "@/lib/logger"
import { TypedSocket } from "@/socket"
import z from "zod"

const schema = z.object({
    channelId: z.uuid(),
})

export function handleJoinChannel(socket: TypedSocket) {
    return async (payload: unknown) => {
        try {
            const { channelId } = schema.parse(payload)

            const user = socket.data.user

            const channel =
                await channelService.getChannelWithMembers(channelId)

            if (!channel) {
                throw new Error("Channel not found")
            }

            const member = channel.members.find((m) => m.userId === user.id)

            if (!member || member.status === "removed") {
                logger.warn("user is not a member")
                throw new Error("You are not a member")
            }

            socket.join(`channel:${channelId}`)
        } catch (err) {
            logger.error(err, "Error in JoinChannel Handler:")
        }
    }
}
