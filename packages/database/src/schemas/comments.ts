import { posts } from "./posts"
import { users } from "./users"
import { createdAt, updatedAt } from "../timestamps"
import { relations } from "drizzle-orm"
import { boolean, index, pgTable, text, uuid } from "drizzle-orm/pg-core"

export const comments = pgTable(
    "comments",
    {
        id: uuid().primaryKey().defaultRandom(),
        postId: uuid()
            .notNull()
            .references(() => posts.id, { onDelete: "cascade" }),
        authorId: uuid()
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        content: text().notNull(),
        isEdited: boolean().default(false).notNull(),
        createdAt,
        updatedAt,
    },
    (table) => [
        index().on(table.postId),
        index().on(table.authorId),
        index().on(table.createdAt),
    ],
)

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
}))
