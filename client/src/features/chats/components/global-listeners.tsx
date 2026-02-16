import useMembersListener from "@/features/chats/hooks/use-members-listener"
import useMessageListener from "@/features/chats/hooks/use-message-listener"
import usePresenceListener from "@/features/chats/hooks/use-presence-listener"
import { useTypingListener } from "@/features/chats/hooks/use-typing-listener"

export default function GlobalListeners() {
    useMessageListener()
    useTypingListener()
    usePresenceListener()
    useMembersListener()

    return null
}
