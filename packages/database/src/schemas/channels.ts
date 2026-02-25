import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core"
import { createdAt } from "../timestamps"
import { type InferSelectModel, relations } from "drizzle-orm"
import { messages } from "./messages"
import { members } from "./members"
import { dms } from "./dms"
import { groups } from "./groups"

export const channelType = pgEnum("channel_type", ["dm", "group"])

export const channels = pgTable("channels", {
    id: uuid().primaryKey().defaultRandom(),
    type: channelType().notNull(),
    createdAt,
})

export type Channel = InferSelectModel<typeof channels>

export const channelsRelations = relations(channels, ({ many, one }) => ({
    messages: many(messages),
    members: many(members),
    dm: one(dms, {
        fields: [channels.id],
        references: [dms.channelId],
    }),
    group: one(groups, {
        fields: [channels.id],
        references: [groups.channelId],
    }),
}))
