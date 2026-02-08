import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core"
import { messages } from "./messages"
import { users } from "./users"

export const messageReceipts = pgTable(
    "message_receipts",
    {
        messageId: uuid("message_id")
            .notNull()
            .references(() => messages.id),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),
        deliveredAt: timestamp("delivered_at"),
        seenAt: timestamp("seen_at"),
    },
    (table) => [primaryKey({ columns: [table.messageId, table.userId] })],
)
