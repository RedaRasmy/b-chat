import { Friendship } from "@bchat/database/tables"
import { Prettify } from "./global"

export type FriendshipRequest = Prettify<
    Friendship & {
        requester: {
            name: string
            avatar: string | null
            role: "admin" | "user"
        }
    }
>
