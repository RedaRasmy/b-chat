import { User } from "@bchat/database/tables"

export type OtherUser = Omit<User, "email">
