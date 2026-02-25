import { pgTable, unique, uuid } from "drizzle-orm/pg-core"
import { channels } from "./channels"
import { users } from "./users"
import { type InferSelectModel, relations } from "drizzle-orm"

export const dms = pgTable(
    "dms",
    {
        channelId: uuid("channel_id")
            .primaryKey()
            .references(() => channels.id, { onDelete: "cascade" }),
        user1Id: uuid("user1_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        user2Id: uuid("user2_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (table) => [unique().on(table.user1Id, table.user2Id)],
)

export type DM = InferSelectModel<typeof dms>

export const dmsRelations = relations(dms, ({ one }) => ({
    user1: one(users, {
        fields: [dms.user1Id],
        references: [users.id],
    }),
    user2: one(users, {
        fields: [dms.user2Id],
        references: [users.id],
    }),
    channel: one(channels, {
        fields: [dms.channelId],
        references: [channels.id],
    }),
}))
