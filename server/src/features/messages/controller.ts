import { messageService } from "@/features/messages/service"
import { emitToChannel } from "@/socket"
import { makeEndpoint } from "@/utils/make-endpoint"
import { IdParam } from "@bchat/shared/validation"

export const deleteMessage = makeEndpoint(
    {
        params: IdParam,
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
