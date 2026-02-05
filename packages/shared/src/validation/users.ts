import z from "zod"
import { SearchSchema } from "./query"

export const QueryUsersSchema = z.object({
    search: SearchSchema,
})
