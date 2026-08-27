import { useUser } from "@/features/auth/use-user"
import { useSocket } from "@/features/chats/hooks/use-socket"
import type { SeeChatData } from "@bchat/shared/validation"
import type { Channels } from "@bchat/types"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useMessages } from "@/features/chats/queries"

export function useChatMessages(channelId: string) {
    const queryClient = useQueryClient()
    const bottomRef = useRef<HTMLDivElement>(null)
    const socket = useSocket()
    const user = useUser()

    const { data: messages = [] } = useMessages(channelId)

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
