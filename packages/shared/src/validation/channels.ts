// import { channels } from "@bchat/database/tables"
import z from "zod"

export const InsertDMSchema = z.object({
    friendId: z.uuid(),
})
