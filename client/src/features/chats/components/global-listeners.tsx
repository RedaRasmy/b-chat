import useMessageListener from "@/features/chats/hooks/use-message-listener"
import { useTypingListener } from "@/features/chats/hooks/use-typing-listener"

export default function GlobalListeners() {
    useMessageListener()
    useTypingListener()

    
    return null
}
