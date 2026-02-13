import { api } from "@/lib/api"
import type {
    Friend,
    Friendship,
    FriendshipRequest,
    OtherUser,
    User,
} from "@bchat/types"

// Queries

export async function fetchUsers(name: string | undefined) {
    const res = await api.get("/users", {
        params: {
            search: name,
        },
    })
    return res.data as OtherUser[]
}

export async function fetchReceivedRequests() {
    const res = await api.get("/friendships/requests/received")
    return res.data as FriendshipRequest[]
}

export async function fetchSentRequests() {
    const res = await api.get("/friendships/requests/sent")
    return res.data as FriendshipRequest[]
}

export async function fetchFriends() {
    const res = await api.get("/friendships/friends")
    return res.data as Friend[]
}

export async function fetchBlocked() {
    const res = await api.get("/friendships/blocked")
    return res.data
}

// Mutations

export async function requestFriendship(id: User["id"]) {
    const res = await api.post("/friendships/" + id)
    return res.data
}

export async function acceptFriendship(id: Friendship["id"]) {
    const res = await api.patch("/friendships/" + id + "/accept")
    return res.data
}

export async function block(id: Friendship["id"]) {
    const res = await api.patch("/friendships/" + id + "/block")
    return res.data
}

export async function rejectFriendship(id: Friendship["id"]) {
    return await api.delete("/friendships/" + id)
}

export async function unfriend(id: Friendship["id"]) {
    return await api.delete("/friendships/" + id)
}

export async function unblock(id: Friendship["id"]) {
    return await api.delete("/friendships/" + id)
}

export async function cancelRequest(id: Friendship["id"]) {
    return await api.delete("/friendships/" + id)

}
