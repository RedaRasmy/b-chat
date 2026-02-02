import {
    pgTable,
    serial,
    varchar,
    timestamp,
    index,
    uuid,
} from "drizzle-orm/pg-core"
import { users } from "."
import { createdAt } from "../timestamps"
import { relations } from "drizzle-orm"

export const refreshTokens = pgTable(
    "refresh_tokens",
    {
        id: serial("id").primaryKey(),
        token: varchar("token", { length: 128 }).notNull().unique(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt,
    },
    (table) => [
        index("idx_refresh_tokens_user_id").on(table.userId),
        index("idx_refresh_tokens_expires_at").on(table.expiresAt),
    ],
)

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}))
