import { Friendship } from "@bchat/database/tables"
import { Prettify } from "./global"
import { OtherUser } from "./users"

export type FriendshipRequest = Prettify<
    Friendship & {
        requester: {
            name: string
            avatar: string | null
            role: "admin" | "user"
        }
    }
>

export type Friend = {
    id: string
    createdAt: Date
    friend: OtherUser
}
