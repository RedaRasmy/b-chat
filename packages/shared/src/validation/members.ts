import type { Member } from "@bchat/types"
import z from "zod"

export const InsertMembersSchema = z.array(z.uuid())

export const UpdateMemberSchema = z.object({
    role: z.enum(["member", "admin"]),
})

export type InsertMembersData = string[]

export type RoleChangedData = {
    userId: string
    userName: string
    oldRole: Member["role"]
    newRole: Member["role"]
}

export type MemberDeletedData = {
    userId: string
    userName: string
}

export type MemberLeftData = {
    userId: string
    userName: string
}
