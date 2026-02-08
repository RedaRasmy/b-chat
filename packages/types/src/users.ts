import { User } from "@bchat/database/tables"

export type OtherUser = Pick<User, "id" | "name" | "avatar" | "role">

export type Profile = Omit<User, "status" | "lastSeen">
