import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core"
import { createdAt } from "../timestamps"
import { InferSelectModel, relations } from "drizzle-orm"
import { messages } from "./messages"
import { members } from "./members"

export const channelType = pgEnum("channel_type", ["dm", "group"])

export const channels = pgTable("channels", {
    id: uuid().primaryKey().defaultRandom(),
    type: channelType().notNull(),
    createdAt,
})

export type Channel = InferSelectModel<typeof channels>

export const channelsRelations = relations(channels, ({ many }) => ({
    messages: many(messages),
    members: many(members),
}))
