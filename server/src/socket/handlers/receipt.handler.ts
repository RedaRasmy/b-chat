import { Socket, Server } from "socket.io"
import { GetMessageSchema, SeeChatSchema } from "@bchat/shared/validation"
import { messageService } from "@/services/message.service"
import { channelService } from "@/services/channel.service"
import { SOCKET_EVENTS } from "../events"
import logger from "@/lib/logger"

export function handleGetMessage(io: Server, socket: Socket) {
    return async (data: any) => {
        logger.info("Message delivered:", data)

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

            io.to(`user:${senderId}`).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
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

export function handleSeeChat(io: Server, socket: Socket) {
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
                    io.to(`user:${msg.senderId}`).emit(
                        SOCKET_EVENTS.CHAT_SEEN,
                        {
                            messageId: msg.id,
                            userId: user.id,
                            seenAt: new Date(),
                            channelId,
                        },
                    )
                })
            }
        } catch (error) {
            logger.error(error, "Error marking chat as seen:")
        }
    }
}
