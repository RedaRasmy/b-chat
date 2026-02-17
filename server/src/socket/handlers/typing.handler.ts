import { TypingSchema } from "@bchat/shared/validation"
import logger from "@/lib/logger"
import { TypedServer, TypedSocket } from "@/socket"

export function handleTyping(io: TypedServer, socket: TypedSocket) {
    return (data: any) => {
        try {
            const { channelId } = TypingSchema.parse(data)

            if (!socket.rooms.has(`channel:${channelId}`)) {
                logger.warn(
                    `User ${socket.user.id} tried to type in unauthorized channel ${channelId}`,
                )
                return
            }

            io.to(`channel:${channelId}`).emit("new_typing", {
                channelId,
                userId: socket.user.id,
                userName: socket.user.name,
            })
        } catch (err) {
            logger.error(err, "Error handling typing:")
        }
    }
}
