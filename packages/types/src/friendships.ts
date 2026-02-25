import type { Friendship, User } from "@bchat/database/tables"
import type { Prettify } from "./global"
import type { OtherUser } from "./users"

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

export type FriendRequestData = { userName: string }
export type RequestAcceptedData = { userName: string }
