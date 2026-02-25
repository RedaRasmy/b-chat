import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { channels } from "./channels"
import { type InferSelectModel, relations } from "drizzle-orm"

export const groups = pgTable("groups", {
    channelId: uuid("channel_id")
        .primaryKey()
        .references(() => channels.id, { onDelete: "cascade" }),
    name: varchar().notNull(),
    avatar: varchar({ length: 2048 }),
})

export type Group = InferSelectModel<typeof groups>

export const groupsRelations = relations(groups, ({ one }) => ({
    channel: one(channels, {
        fields: [groups.channelId],
        references: [channels.id],
    }),
}))
