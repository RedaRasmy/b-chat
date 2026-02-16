import db from "@bchat/database"
import { messages, messageReceipts } from "@bchat/database/tables"
import { ChatMessage, MessageReceipt } from "@bchat/types"
import { and, eq, exists, inArray, isNull } from "drizzle-orm"

export class MessageService {
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
