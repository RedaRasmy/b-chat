import z from "zod"
import { SearchSchema } from "./query.js"

export const QueryUsersSchema = z.object({
    search: SearchSchema,
})
