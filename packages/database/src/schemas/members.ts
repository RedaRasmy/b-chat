import {
    index,
    pgTable,
    primaryKey,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core"
import { channels } from "./channels"
import { users } from "./users"

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
    },
    (table) => [
        primaryKey({ columns: [table.channelId, table.userId] }),
        index().on(table.userId),
        index().on(table.channelId),
    ],
)
