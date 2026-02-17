import { useSocketListener } from "@/features/chats/hooks/use-socket-listener"
import type { Channels, Friend } from "@bchat/types"
import { useQueryClient } from "@tanstack/react-query"

export default function usePresenceListener() {
    const queryClient = useQueryClient()

    useSocketListener("user_status_changed", (data) => {
        console.log("user-status changed : ", data)
        queryClient.setQueryData(["friends"], (old: Friend[] = []) => {
            return old.map((friend) => {
                if (friend.id === data.userId) {
                    return {
                        ...friend,
                        status: data.status,
                        lastSeen: data.lastSeen,
                    }
                } else {
                    return friend
                }
            })
        })
        queryClient.setQueryData(["chats"], (old: Channels = []) =>
            old.map((chat) => {
                if (chat.type === "group") return chat
                const friend = chat.members.find(
                    (mem) => mem.id === data.userId,
                )
                if (!friend) return chat
                return {
                    ...chat,
                    status: data.status,
                    lastSeen: data.lastSeen,
                }
            }),
        )
    })
}
