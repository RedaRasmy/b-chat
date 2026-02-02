import { timestamp } from "drizzle-orm/pg-core"

export const createdAt = timestamp("created_at").defaultNow().notNull()

export const updatedAt = timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()

export const deletedAt = timestamp("deleted_at")

export const timestamps = {
    createdAt,
    updatedAt,
}

export const fullTimestamps = {
    createdAt,
    updatedAt,
    deletedAt,
}