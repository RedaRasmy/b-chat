import { useAuth } from "@/features/auth/use-auth"
import { fetchMessages } from "@/features/chats/requests"
import { useSocket } from "@/features/chats/use-socket"
import type { SeeChatData } from "@bchat/shared/validation"
import type { Channels } from "@bchat/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useChatMessages(channelId: string) {
    const queryClient = useQueryClient()
    const bottomRef = useRef<HTMLDivElement>(null)
    const socket = useSocket()
    const { user } = useAuth()

    const { data: messages = [] } = useQuery({
        queryKey: ["messages", channelId],
        queryFn: () => fetchMessages(channelId),
        staleTime: Infinity,
    })

    useEffect(() => {
        // queryClient.invalidateQueries({
        //     queryKey: ["chats"],
        // })
        queryClient.invalidateQueries({
            queryKey: ["messages", channelId],
        })
    }, [queryClient, channelId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView()
    }, [messages])

    useEffect(() => {
        const readData: SeeChatData = {
            channelId,
        }
        socket.emit("see_chat", readData)
    }, [socket, channelId, messages])

    useEffect(() => {
        if (!user) return
        queryClient.setQueryData(["chats"], (old: Channels = []) => {
            return old.map((channel) => {
                if (channel.id !== channelId) return channel
                const lastMessage = channel.lastMessage
                if (!lastMessage) return lastMessage
                return {
                    ...channel,
                    lastMessage:
                        lastMessage.senderId === user.id
                            ? lastMessage
                            : {
                                  ...channel.lastMessage,
                                  seenAt: new Date(),
                              },
                }
            })
        })
    }, [queryClient, channelId, user])

    return {
        messages,
        bottomRef,
    }
}
