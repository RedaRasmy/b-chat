import { Member, User } from "@bchat/database/tables"
import { Prettify } from "./global"

export type OtherUser = Pick<User, "id" | "name" | "avatar" | "role">

export type Profile = Omit<User, "status" | "lastSeen">

export type StatusChangeData = {
    userId: User["id"]
    status: User["status"]
    lastSeen: User["lastSeen"]
}

export type UserStatus = Pick<User, "status" | "lastSeen">

export type ChatMember = Prettify<
    OtherUser & {
        joinedAt: Member["joinedAt"]
        chatRole: Member["role"]
    }
>
