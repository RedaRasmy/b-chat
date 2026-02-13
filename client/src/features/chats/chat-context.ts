import type { Chat, ChatMember } from "@bchat/types"
import { createContext } from "react"

type ChatContext = {
    chat: Chat
    members: Map<string, ChatMember>
}

export const ChatContext = createContext<ChatContext | null>(null)
