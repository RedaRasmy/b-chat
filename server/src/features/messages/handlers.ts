import { emitToChannel } from "@/socket"
import { makeParamsEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { messages } from "@bchat/database/tables"
import { canDeleteMessage } from "@bchat/shared/permissions"
import { eq } from "drizzle-orm"

export const deleteMessage = makeParamsEndpoint(
    ["id"],
    async (req, res, next) => {
        const id = req.params.id
        const user = req.user!

        try {
            const message = await db.query.messages.findFirst({
                where: (msgs, { eq }) => eq(msgs.id, id),
                with: {
                    channel: {
                        with: {
                            members: true,
                        },
                    },
                },
            })
            if (!message) {
                return res.status(404).json({
                    message: "Message not found",
                })
            }

            const members = message.channel.members
            const userMember = members.find((mem) => mem.userId === user.id)
            const senderMember = members.find(
                (mem) => mem.userId === message.senderId,
            )

            if (
                !userMember ||
                !senderMember ||
                !canDeleteMessage(userMember, senderMember)
            ) {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            await db.delete(messages).where(eq(messages.id, id))

            emitToChannel(message.channelId, "message_deleted", {
                messageId: message.id,
                channelId: message.channelId,
            })

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
