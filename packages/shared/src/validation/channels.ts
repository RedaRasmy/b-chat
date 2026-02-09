// import { channels } from "@bchat/database/tables"
import z from "zod"

export const InsertDMSchema = z.object({
    friendId: z.uuid(),
})

export type DMFormData = z.infer<typeof InsertDMSchema>

export const NewDMSchema = z.object({
    channelId: z.uuid(),
    friendId: z.uuid(),
})
