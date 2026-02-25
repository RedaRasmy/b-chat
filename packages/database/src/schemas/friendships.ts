import { relations, type InferSelectModel } from "drizzle-orm"
import {
    pgTable,
    uuid,
    pgEnum,
    index,
    unique,
    timestamp,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { createdAt, updatedAt } from "../timestamps"

export const friendshipStatus = pgEnum("friendship_status", [
    "pending",
    "friend",
    "blocked",
])

export const friendships = pgTable(
    "friendships",
    {
        id: uuid().primaryKey().defaultRandom(),
        requesterId: uuid("requester_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        receiverId: uuid("receiver_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        status: friendshipStatus().default("pending").notNull(),
        blockedBy: uuid("blocked_by").references(() => users.id),
        blockedAt: timestamp("blocked_at"),
        acceptedAt: timestamp("accepted_at"),
        createdAt,
        updatedAt,
    },
    (table) => [
        index().on(table.requesterId),
        index().on(table.receiverId),
        unique().on(table.requesterId, table.receiverId),
    ],
)

export const friendshipsRelations = relations(friendships, ({ one }) => ({
    requester: one(users, {
        fields: [friendships.requesterId],
        references: [users.id],
        relationName: "requester",
    }),
    receiver: one(users, {
        fields: [friendships.receiverId],
        references: [users.id],
        relationName: "receiver",
    }),
}))

export type Friendship = InferSelectModel<typeof friendships>
