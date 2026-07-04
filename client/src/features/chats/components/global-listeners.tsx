import useFriendsListener from "@/features/friendships/use-friends-listener"
import useMembersListener from "@/features/chats/groups/use-members-listener"
import useMessageListener from "@/features/chats/hooks/use-message-listener"
import usePresenceListener from "@/features/profile/use-presence-listener"
import { useTypingListener } from "@/features/chats/hooks/use-typing-listener"
import { useConnectionListener } from "@/features/chats/hooks/use-connection-listener"

export default function GlobalListeners() {
    useConnectionListener()
    //
    useMessageListener()
    useTypingListener()
    usePresenceListener()
    useMembersListener()
    useFriendsListener()

    return null
}
