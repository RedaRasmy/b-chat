import type { Channels } from "@bchat/types"
import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useUser } from "@/features/auth/use-user"
import { useSocketListener } from "@/features/chats/hooks/use-socket-listener"

export function useTypingListener() {
    const typingTimeoutsRef = useRef<Map<string, number>>(new Map())
    const user = useUser()
    const queryClient = useQueryClient()

    useSocketListener("new_typing", ({ channelId, userId, userName }) => {
        if (user.id === userId) return

        if (typingTimeoutsRef.current.has(channelId)) {
            clearTimeout(typingTimeoutsRef.current.get(channelId))
            typingTimeoutsRef.current.delete(channelId)
        }

        queryClient.setQueryData(["chats"], (old: Channels = []) =>
            old.map((chat) => {
                if (chat.id === channelId) {
                    return {
                        ...chat,
                        typingUser: userName,
                    }
                }
                return chat
            }),
        )

        const timeout = setTimeout(() => {
            queryClient.setQueryData(["chats"], (old: Channels = []) =>
                old.map((chat) => {
                    if (chat.id === channelId) {
                        return {
                            ...chat,
                            typingUser: undefined,
                        }
                    }
                    return chat
                }),
            )
            typingTimeoutsRef.current.delete(channelId)
        }, 3000)

        typingTimeoutsRef.current.set(channelId, timeout)
    })

    useEffect(() => {
        const timeouts = typingTimeoutsRef.current

        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout))
            timeouts.clear()
        }
    }, [])
}
