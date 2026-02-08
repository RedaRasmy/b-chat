import { pgTable, unique, uuid } from "drizzle-orm/pg-core"
import { channels } from "./channels"
import { users } from "./users"
import { relations } from "drizzle-orm"

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
