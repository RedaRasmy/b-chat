import { messageService } from "@/features/messages/service"
import { emitToUser, TypedSocket } from "@/socket"
import z from "zod"
import logger from "@/lib/logger"

const schema = z.int().min(0)

export function handleSyncMessages(socket: TypedSocket) {
    return async (data: unknown) => {
        const result = schema.safeParse(data)
        if (!result.success) {
            logger.error(result.error.issues, "Sync handler: invalid data")
            return
        }

        const order = result.data

        const user = socket.data.user

        try {
            const missingMessages = await messageService.getMissingMessages(
                user.id,
                order,
            )

            emitToUser(user.id, "missing_messages", missingMessages)
        } catch (err) {
            logger.error(err, "Failed to get missing messages:")
        }
    }
}
