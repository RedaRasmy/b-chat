import { comments } from "./comments"
import { users } from "./users"
import { createdAt, updatedAt } from "../timestamps"
import { relations } from "drizzle-orm"
import {
    boolean,
    index,
    integer,
    pgTable,
    text,
    uuid,
} from "drizzle-orm/pg-core"

export const posts = pgTable(
    "posts",
    {
        id: uuid().primaryKey().defaultRandom(),
        authorId: uuid()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        content: text().notNull(),
        commentsCount: integer().default(0).notNull(),
        isEdited: boolean().default(false).notNull(),
        createdAt,
        updatedAt,
    },
    (table) => [index().on(table.authorId), index().on(table.createdAt)],
)

export const postsRelations = relations(posts, ({ many, one }) => ({
    comments: many(comments),
    author: one(users),
}))
