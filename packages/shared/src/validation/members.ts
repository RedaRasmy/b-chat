import { members } from "@bchat/database/tables"
import { createInsertSchema } from "drizzle-zod"
import z from "zod"

export const InsertMemberSchema = z.array(
    createInsertSchema(members).omit({
        joinedAt: true,
        channelId: true,
    }),
)
