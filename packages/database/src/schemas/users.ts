import { relations } from "drizzle-orm"
import { pgTable, varchar, uuid, pgEnum } from "drizzle-orm/pg-core"
import { refreshTokens } from "./refresh-tokens"
import { friendships } from "@/schemas/friendships"

export const role = pgEnum("role", ["admin", "user"])

export const users = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 30 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    avatar: varchar({ length: 2048 }),
    role: role().default("user").notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    githubId: varchar("github_id", { length: 255 }).unique(),
    googleId: varchar("google_id", { length: 255 }).unique(),
})

export const usersRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
    sentFriendships: many(friendships, { relationName: "requester" }),
    receivedFriendships: many(friendships, { relationName: "receiver" }),
}))
