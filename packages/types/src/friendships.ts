import { Friendship, User } from "@bchat/database/tables"
import { Prettify } from "./global"
import { OtherUser } from "./users"

export type FriendshipRequest = Prettify<
    Friendship & {
        requester: OtherUser
    }
>

export type Friend = Prettify<
    Omit<User, "email"> &
        Pick<Friendship, "acceptedAt" | "createdAt"> & {
            friendshipId: Friendship["id"]
        }
>
