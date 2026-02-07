import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core"
import { createdAt } from "../timestamps"

export const channelType = pgEnum("channel_type", ["dm", "group"])

export const channels = pgTable("channels", {
    id: uuid().primaryKey().defaultRandom(),
    type: channelType().notNull(),
    createdAt,
})
