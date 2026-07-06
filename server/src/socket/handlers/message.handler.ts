import { MessageAck } from "@bchat/types"
import { SendMessageData, SendMessageSchema } from "@bchat/shared/validation"
import { messageService } from "@/features/messages/service"
import { channelService } from "@/features/channels/service"
import { TypedServer, TypedSocket } from "@/socket"
import logger from "@/lib/logger"

export function handleSendMessage(io: TypedServer, socket: TypedSocket) {
    return async (
        msg: SendMessageData,
        callback: (response: MessageAck) => void,
    ) => {
        const result = SendMessageSchema.safeParse(msg)
        if (!result.success) {
            return callback({
                success: false,
                error: "Invalid message data",
                tempId: msg.tempId,
                channelId: msg.channelId,
            })
        }

        const { content, channelId, tempId } = result.data
        const user = socket.data.user

        if (content.trim().length === 0) {
            return callback({
                success: false,
                error: "Message cannot be empty",
                tempId,
                channelId,
            })
        }

        try {
            const channel =
                await channelService.getChannelWithMembers(channelId)

            if (!channel) {
                throw new Error("Channel not found")
            }

            const member = channel.members.find((m) => m.userId === user.id)
            if (!member || member.status === "removed") {
                throw new Error("You are not a member")
            }

            const recipients = channel.members.filter(
                (m) => m.userId !== user.id,
            )

            const message = await messageService.createMessage({
                channelId,
                content,
                senderId: user.id,
                recipientIds: recipients.map((r) => r.userId),
            })

            io.to(`channel:${channelId}`).emit("new_message", message)

            callback({
                success: true,
                messageId: message.id,
                tempId,
                channelId,
            })
        } catch (err) {
            logger.error(err, "Error sending message:")
            callback({
                success: false,
                tempId,
                channelId,
            })
        }
    }
}
