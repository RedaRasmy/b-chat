import type { GroupChat, ChatMember } from "@bchat/types"
import { createContext } from "react"

type GroupContextValue = {
    chat: GroupChat
    role: ChatMember["chatRole"]
    members: Map<string, ChatMember>
}

export const GroupContext = createContext<GroupContextValue | null>(null)
