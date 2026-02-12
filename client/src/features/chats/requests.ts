import { api } from "@/lib/api"
import type {
    DMFormData,
    GroupFormData,
    InsertMembersData,
} from "@bchat/shared/validation"
import type { Channel, Channels, ChatMessage, DM, Group } from "@bchat/types"

export async function createDM(data: DMFormData) {
    const res = await api.post("/channels/dm", data)
    return res.data as DM
}

export async function createGroup(data: GroupFormData) {
    const res = await api.post("/channels/group", data)
    return res.data as Group
}

export async function createMembers({
    channelId,
    data,
}: {
    channelId: string
    data: InsertMembersData
}) {
    return await api.post("/members/" + channelId, data)
}

export async function exitGroup(id: string) {
    return await api.delete("/members/" + id)
}

export async function deleteMember({
    channelId,
    userId,
}: {
    channelId: string
    userId: string
}) {
    return await api.delete(`/members/${channelId}/${userId}`)
}

export async function updateMember({
    channelId,
    userId,
    role,
}: {
    channelId: string
    userId: string
    role: "admin" | "member"
}) {
    return await api.patch(`/members/${channelId}/${userId}`, { role })
}

export async function fetchChats() {
    const res = await api.get("/channels")
    return res.data as Channels
}

export async function fetchMessages(id: Channel["id"]) {
    const res = await api.get(`/channels/${id}/messages`)
    return res.data as ChatMessage[]
}

export async function deleteMessage(id: string) {
    const res = await api.delete("/messages/" + id)
    return res
}

export async function deleteChat(id: string) {
    return await api.delete("/channels/" + id)
}
