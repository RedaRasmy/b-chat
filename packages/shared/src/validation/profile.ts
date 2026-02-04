import z from "zod"
import { NameSchema } from "./auth"

export const UpdateProfileSchema = z.object({
    name: NameSchema,
})
