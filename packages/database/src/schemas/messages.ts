import { index, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { channels } from "./channels"
import { users } from "./users"
import { createdAt, updatedAt } from "../timestamps"
import { InferSelectModel, relations } from "drizzle-orm"

export const messages = pgTable(
    "messages",
    {
        id: uuid().primaryKey().defaultRandom(),
        channelId: uuid("channel_id")
            .notNull()
            .references(() => channels.id, { onDelete: "cascade" }),
        senderId: uuid("sender_id")
            .notNull()
            .references(() => users.id),
        content: text().notNull(),
        createdAt,
        updatedAt,
    },
    (table) => [index().on(table.channelId), index().on(table.createdAt)],
)

export type ChatMessage = InferSelectModel<typeof messages>

export const messagesRelations = relations(messages, ({ one }) => ({
    channel: one(channels, {
        fields: [messages.channelId],
        references: [channels.id],
    }),
    sender: one(users, {
        fields: [messages.senderId],
        references: [users.id],
    }),
}))
