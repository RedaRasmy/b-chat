import { Server, Socket } from "socket.io"
import { TypingSchema } from "@bchat/shared/validation"
import { SERVER_EVENTS } from "../events"
import logger from "@/lib/logger"
import { TypingData } from "@bchat/types"

export function handleTyping(io: Server, socket: Socket) {
    return (data: any) => {
        try {
            const { channelId } = TypingSchema.parse(data)

            if (!socket.rooms.has(`channel:${channelId}`)) {
                logger.warn(
                    `User ${socket.user.id} tried to type in unauthorized channel ${channelId}`,
                )
                return
            }

            io.to(`channel:${channelId}`).emit(SERVER_EVENTS.NEW_TYPING, {
                channelId,
                userId: socket.user.id,
                userName: socket.user.name,
            } satisfies TypingData)
        } catch (err) {
            logger.error(err, "Error handling typing:")
        }
    }
}
