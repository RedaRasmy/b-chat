import { index, pgTable, bigserial, text, uuid } from "drizzle-orm/pg-core"
import { channels } from "./channels.js"
import { users } from "./users.js"
import { createdAt, updatedAt } from "../timestamps.js"
import { type InferSelectModel, relations } from "drizzle-orm"
import { messageReceipts } from "./message-receipts.js"

export const messages = pgTable(
    "messages",
    {
        id: uuid().primaryKey().defaultRandom(),
        channelId: uuid("channel_id")
            .notNull()
            .references(() => channels.id, { onDelete: "cascade" }),
        senderId: uuid("sender_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        content: text().notNull(),
        order: bigserial({ mode: "number" }),
        createdAt,
        updatedAt,
    },
    (table) => [index().on(table.channelId), index().on(table.createdAt)],
)

export type Message = InferSelectModel<typeof messages>

export const messagesRelations = relations(messages, ({ one, many }) => ({
    channel: one(channels, {
        fields: [messages.channelId],
        references: [channels.id],
    }),
    sender: one(users, {
        fields: [messages.senderId],
        references: [users.id],
    }),
    receipts: many(messageReceipts),
}))
