import { api } from "@/lib/api"
import type { DMFormData } from "@bchat/shared/validation"
import type { Channel, Channels, ChatMessage, DM } from "@bchat/types"

export async function createDM(data: DMFormData) {
    const res = await api.post("/channels/dm", data)
    return res.data as DM
}

export async function fetchChats() {
    const res = await api.get("/channels")
    return res.data as Channels
}

export async function fetchMessages(id: Channel["id"]) {
    const res = await api.get(`/channels/${id}/messages`)
    return res.data as ChatMessage[]
}
