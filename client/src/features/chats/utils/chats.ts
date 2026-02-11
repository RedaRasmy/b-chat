import type { Chat, DMChat, OtherUser } from "@bchat/types"

export function getChatName(chat: Chat, currentUserId: string): string {
    if (chat.type === "group") {
        return chat.name
    }
    const otherUser = chat.members.find((m) => m.id !== currentUserId)
    return otherUser?.name || "Unknown"
}

export function getChatAvatar(
    chat: Chat,
    currentUserId: string,
): string | null {
    if (chat.type === "group") {
        return chat.avatar
    }
    const otherUser = chat.members.find((m) => m.id !== currentUserId)
    return otherUser?.avatar || null
}

export function getOtherUser(
    chat: DMChat,
    currentUserId: string,
): OtherUser | undefined {
    return chat.members.find((m) => m.id !== currentUserId)
}
