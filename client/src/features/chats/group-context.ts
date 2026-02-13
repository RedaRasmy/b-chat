import type { GroupChat, ChatMember } from "@bchat/types"
import { createContext } from "react"

type GroupContextValue = {
    chat: GroupChat
    role: ChatMember["chatRole"]
    members: Map<string, ChatMember>
    isOwner : boolean
    isAdmin : boolean
    isMember : boolean
}

export const GroupContext = createContext<GroupContextValue | null>(null)
