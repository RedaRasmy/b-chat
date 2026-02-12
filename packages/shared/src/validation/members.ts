import z from "zod"

export const InsertMembersSchema = z.array(z.uuid())

export const UpdateMemberSchema = z.object({
    role: z.enum(["member", "admin"]),
})

export type InsertMembersData = string[]
