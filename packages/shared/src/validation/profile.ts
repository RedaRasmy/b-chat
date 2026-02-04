import z from "zod"
import { NameSchema } from "./auth"
import { users } from "@bchat/database/tables"
import { createSelectSchema } from "drizzle-zod"

export const SelectProfileSchema = createSelectSchema(users).omit({
    githubId: true,
    googleId: true,
    hashedPassword: true,
})
export const UpdateProfileSchema = z.object({
    name: NameSchema,
})

export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>
export type Profile = z.infer<typeof SelectProfileSchema>
