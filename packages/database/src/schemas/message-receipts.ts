import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core"
import { messages } from "./messages"
import { users } from "./users"
import { relations } from "drizzle-orm"

export const messageReceipts = pgTable(
    "message_receipts",
    {
        messageId: uuid("message_id")
            .notNull()
            .references(() => messages.id, { onDelete: "cascade" }),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        deliveredAt: timestamp("delivered_at"),
        seenAt: timestamp("seen_at"),
    },
    (table) => [primaryKey({ columns: [table.messageId, table.userId] })],
)

export const receiptsRelations = relations(messageReceipts, ({ one }) => ({
    receiver: one(users, {
        fields: [messageReceipts.userId],
        references: [users.id],
    }),
    message: one(messages, {
        fields: [messageReceipts.messageId],
        references: [messages.id],
    }),
}))
