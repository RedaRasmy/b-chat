import type { Channels, NewTypingData } from "@bchat/types"
import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useUser } from "@/features/auth/use-user"
import { useSocket } from "@/features/chats/use-socket"

export function useTypingListener() {
    const socket = useSocket()
    const typingTimeoutsRef = useRef<Map<string, number>>(new Map())
    const user = useUser()
    const queryClient = useQueryClient()

    useEffect(() => {
        const timeouts = typingTimeoutsRef.current

        function typingHandler({ channelId, userId, userName }: NewTypingData) {
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
        }

        socket.on("new_typing", typingHandler)

        return () => {
            socket.off("new_typing", typingHandler)
            timeouts.forEach((timeout) => clearTimeout(timeout))
            timeouts.clear()
        }
    }, [socket, user, queryClient])
}
