import { ChatContext } from "@/features/chats/chat-context"
import { useContext } from "react"

export function useChat() {
    const context = useContext(ChatContext)
    if (!context) throw new Error("useChat must be used within ChatProvider")
    return context
}
