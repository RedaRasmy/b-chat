import { ForbiddenError, NotFoundError } from "@/errors"
import db from "@bchat/database"
import { messages, messageReceipts } from "@bchat/database/tables"
import { canDeleteMessage } from "@bchat/shared/permissions"
import { ChatMessage } from "@bchat/types"
import { and, eq, exists, inArray, isNull } from "drizzle-orm"

export class MessageService {
    async deleteMessageWithAuth(messageId: string, userId: string) {
        const message = await db.query.messages.findFirst({
            where: eq(messages.id, messageId),
            with: {
                channel: {
                    with: {
                        members: {
                            where: (members, { eq }) =>
                                eq(members.status, "active"),
                        },
                    },
                },
            },
        })

        if (!message) {
            throw new NotFoundError("Message not found")
        }

        const userMember = message.channel.members.find(
            (m) => m.userId === userId,
        )
        const senderMember = message.channel.members.find(
            (m) => m.userId === message.senderId,
        )

        if (
            !userMember ||
            !senderMember ||
            !canDeleteMessage(userMember, senderMember)
        ) {
            throw new ForbiddenError("Cannot delete this message")
        }

        await db.delete(messages).where(eq(messages.id, messageId))

        return {
            messageId: message.id,
            channelId: message.channelId,
        }
    }

    async deleteMessage(messageId: string) {
        await db.delete(messages).where(eq(messages.id, messageId))
    }

    async createMessage({
        channelId,
        content,
        senderId,
        recipientIds,
    }: {
        channelId: string
        content: string
        senderId: string
        recipientIds: string[]
    }) {
        return await db.transaction(async (tx) => {
            const [message] = await tx
                .insert(messages)
                .values({
                    channelId,
                    content,
                    senderId,
                })
                .returning()

            const receipts =
                recipientIds.length > 0
                    ? await tx
                          .insert(messageReceipts)
                          .values(
                              recipientIds.map((userId) => ({
                                  messageId: message.id,
                                  userId,
                              })),
                          )
                          .returning()
                    : []

            return { ...message, receipts } satisfies ChatMessage
        })
    }

    async markAsDelivered(messageId: string, userId: string) {
        return await db
            .update(messageReceipts)
            .set({ deliveredAt: new Date() })
            .where(
                and(
                    eq(messageReceipts.messageId, messageId),
                    eq(messageReceipts.userId, userId),
                ),
            )
    }

    async getUnreadMessages(channelId: string, userId: string) {
        return await db.query.messages.findMany({
            where: and(
                eq(messages.channelId, channelId),
                exists(
                    db
                        .select()
                        .from(messageReceipts)
                        .where(
                            and(
                                eq(messageReceipts.messageId, messages.id),
                                eq(messageReceipts.userId, userId),
                                isNull(messageReceipts.seenAt),
                            ),
                        ),
                ),
            ),
        })
    }

    async markMessagesAsSeen(messageIds: string[], userId: string) {
        return await db
            .update(messageReceipts)
            .set({ seenAt: new Date() })
            .where(
                and(
                    inArray(messageReceipts.messageId, messageIds),
                    eq(messageReceipts.userId, userId),
                ),
            )
    }
}

export const messageService = new MessageService()
