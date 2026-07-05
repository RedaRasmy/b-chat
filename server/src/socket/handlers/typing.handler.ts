import { TypingSchema } from "@bchat/shared/validation"
import logger from "@/lib/logger"
import { TypedServer, TypedSocket } from "@/socket"

export function handleTyping(io: TypedServer, socket: TypedSocket) {
    return (data: unknown) => {
        try {
            const { channelId } = TypingSchema.parse(data)
            const user = socket.data.user

            if (!socket.rooms.has(`channel:${channelId}`)) {
                logger.warn(
                    `User ${user.id} tried to type in unauthorized channel ${channelId}`,
                )
                return
            }

            io.to(`channel:${channelId}`).emit("new_typing", {
                channelId,
                userId: user.id,
                userName: user.name,
            })
        } catch (err) {
            logger.error(err, "Error handling typing:")
        }
    }
}
