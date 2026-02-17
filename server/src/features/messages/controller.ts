import { messageService } from "@/features/messages/service"
import { emitToChannel } from "@/socket"
import { makeEndpoint } from "@/utils/make-endpoint"
import z from "zod"

export const deleteMessage = makeEndpoint(
    {
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const id = req.params.id
        const user = req.user!

        try {
            const { channelId, messageId } =
                await messageService.deleteMessageWithAuth(id, user.id)

            emitToChannel(channelId, "message_deleted", {
                messageId,
                channelId,
            })

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
