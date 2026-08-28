import type { Friendship, User } from "@bchat/database/tables"
import type { Prettify } from "./global.js"
import type { OtherUser } from "./users.js"

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
