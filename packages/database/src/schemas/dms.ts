import { pgTable, unique, uuid } from "drizzle-orm/pg-core"
import { channels } from "./channels"
import { users } from "./users"

export const dms = pgTable(
    "dms",
    {
        channelId: uuid("channel_id")
            .primaryKey()
            .references(() => channels.id, { onDelete: "cascade" }),
        user1Id: uuid("user1_id")
            .notNull()
            .references(() => users.id),
        user2Id: uuid("user2_id")
            .notNull()
            .references(() => users.id),
    },
    (table) => [unique().on(table.user1Id, table.user2Id)],
)
