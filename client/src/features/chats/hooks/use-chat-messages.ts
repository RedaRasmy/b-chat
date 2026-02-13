import { useUser } from "@/features/auth/use-user"
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
    const user = useUser()

    const { data: messages = [] } = useQuery({
        queryKey: ["messages", channelId],
        queryFn: () => fetchMessages(channelId),
        staleTime: Infinity,
    })

    useEffect(() => {
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
        queryClient.setQueryData(["chats"], (old: Channels = []) =>
            old.map((channel) => {
                if (channel.id !== channelId) return channel
                const lastMessage = channel.lastMessage
                if (!lastMessage) return channel
                if (lastMessage.senderId === user.id) return channel

                return {
                    ...channel,
                    lastMessage: {
                        ...lastMessage,
                        receipts: [],
                    },
                }
            }),
        )
    }, [queryClient, channelId, user])

    return {
        messages,
        bottomRef,
    }
}
