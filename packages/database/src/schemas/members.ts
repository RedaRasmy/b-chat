import {
    index,
    pgEnum,
    pgTable,
    primaryKey,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core"
import { channels } from "./channels"
import { users } from "./users"
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"

export const chatRole = pgEnum("chat_role", ["owner", "admin", "member"])

export const members = pgTable(
    "members",
    {
        channelId: uuid("channel_id")
            .notNull()
            .references(() => channels.id, { onDelete: "cascade" }),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        joinedAt: timestamp("joined_at").notNull().defaultNow(),
        role: chatRole().default("member").notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.channelId, table.userId] }),
        index().on(table.userId),
        index().on(table.channelId),
    ],
)

export type Member = InferSelectModel<typeof members>
export type IMember = InferInsertModel<typeof members>

export const membersRelations = relations(members, ({ one }) => ({
    channel: one(channels, {
        fields: [members.channelId],
        references: [channels.id],
    }),
    user: one(users, {
        fields: [members.userId],
        references: [users.id],
    }),
}))
