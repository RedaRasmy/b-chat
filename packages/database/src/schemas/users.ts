import { InferSelectModel, relations } from "drizzle-orm"
import { pgTable, varchar, uuid, pgEnum, timestamp } from "drizzle-orm/pg-core"
import { refreshTokens } from "./refresh-tokens"
import { friendships } from "./friendships"
import { posts } from "./posts"
import { comments } from "./comments"
import { messages } from "./messages"
import { members } from "./members"
import { dms } from "./dms"
import { messageReceipts } from "./message-receipts"

export const role = pgEnum("role", ["admin", "user"])
export const userStatus = pgEnum("user_status", ["online", "offline"])

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 30 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    avatar: varchar({ length: 2048 }),
    role: role().default("user").notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    githubId: varchar("github_id", { length: 255 }).unique(),
    googleId: varchar("google_id", { length: 255 }).unique(),
    status: userStatus().default("offline").notNull(),
    lastSeen: timestamp("last_seen").defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
    sentFriendships: many(friendships, { relationName: "requester" }),
    receivedFriendships: many(friendships, { relationName: "receiver" }),
    posts: many(posts),
    comments: many(comments),
    messages: many(messages),
    members: many(members),
    dms: many(dms),
    receipts: many(messageReceipts),
}))

export type User = Omit<
    InferSelectModel<typeof users>,
    "hashedPassword" | "githubId" | "googleId"
>
