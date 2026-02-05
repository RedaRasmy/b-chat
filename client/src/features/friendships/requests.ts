import { api } from "@/lib/api"
import type { User } from "@bchat/types"

// Queries

export async function getPendingReceived() {
    const res = await api.get("/friendships/pending/received")
    return res.data
}

export async function getPendingSent() {
    const res = await api.get("/friendships/pending/sent")
    return res.data
}

export async function getFriends() {
    const res = await api.get("/friendships/friends")
    return res.data
}

export async function getBlocked() {
    const res = await api.get("/friendships/blocked")
    return res.data
}

// Mutations

export async function requestFriendship(id: User["id"]) {
    const res = await api.post("/friendships/" + id)
    return res.data
}

export async function acceptFriendship(id: User["id"]) {
    const res = await api.patch("/friendships/" + id + "/accept")
    return res.data
}

export async function block(id: User["id"]) {
    const res = await api.patch("/friendships/" + id + "/block")
    return res.data
}

export async function rejectFriendship(id: User["id"]) {
    const res = await api.delete("/friendships/" + id + "/remove")
    return res
}

export async function unfriend(id: User["id"]) {
    const res = await api.delete("/friendships/" + id + "/remove")
    return res
}

export async function unblock(id: User["id"]) {
    const res = await api.delete("/friendships/" + id + "/remove")
    return res
}
