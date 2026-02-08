import { User } from "@bchat/database/tables"

export type OtherUser = Pick<User, "id" | "name" | "avatar" | "role">

export type Profile = Omit<User, "status" | "lastSeen">

export type StatusChangeData = {
    userId: User["id"]
    status: User["status"]
    lastSeen: User["lastSeen"]
}

export type UserStatus = Pick<User, "status" | "lastSeen">
