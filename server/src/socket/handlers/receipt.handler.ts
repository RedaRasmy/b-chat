import { GetMessageSchema, SeeChatSchema } from "@bchat/shared/validation"
import logger from "@/lib/logger"
import { messageService } from "@/features/messages/service"
import { channelService } from "@/features/channels/service"
import { TypedServer, TypedSocket } from "@/socket"

export function handleGetMessage(io: TypedServer, socket: TypedSocket) {
    return async (data: any) => {
        try {
            const { channelId, messageId, senderId } =
                GetMessageSchema.parse(data)
            const user = socket.user

            const channel = await channelService.verifyUserInChannel(
                channelId,
                user.id,
            )
            if (!channel) {
                throw new Error("Channel not found")
            }

            await messageService.markAsDelivered(messageId, user.id)

            io.to(`user:${senderId}`).emit("message_delivered", {
                messageId,
                receiverId: user.id,
                deliveredAt: new Date(),
                channelId,
            })
        } catch (err) {
            logger.error(err, "Error marking message as delivered:")
        }
    }
}

export function handleSeeChat(io: TypedServer, socket: TypedSocket) {
    return async (data: any) => {
        try {
            const { channelId } = SeeChatSchema.parse(data)
            const user = socket.user

            const channel = await channelService.verifyUserInChannel(
                channelId,
                user.id,
            )
            if (!channel) {
                throw new Error("Channel not found")
            }

            const unreadMessages = await messageService.getUnreadMessages(
                channelId,
                user.id,
            )

            if (unreadMessages.length > 0) {
                await messageService.markMessagesAsSeen(
                    unreadMessages.map((m) => m.id),
                    user.id,
                )

                unreadMessages.forEach((msg) => {
                    io.to(`user:${msg.senderId}`).emit("chat_seen", {
                        messageId: msg.id,
                        userId: user.id,
                        seenAt: new Date(),
                        channelId,
                    })
                })
            }
        } catch (error) {
            logger.error(error, "Error marking chat as seen:")
        }
    }
}
