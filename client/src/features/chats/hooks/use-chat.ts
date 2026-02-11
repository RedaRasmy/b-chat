import { fetchChats } from "@/features/chats/requests"
import type { OtherUser } from "@bchat/types"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export function useChat(channelId: string) {
    const { data: chats, isLoading } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
        staleTime: Infinity,
    })

    const chat = chats ? chats.find((c) => c.id === channelId) : undefined

    const members: Map<string, OtherUser> = useMemo(() => {
        if (!chat) return new Map()
        return new Map(chat.members.map((m) => [m.id, m]))
    }, [chat])

    return {
        chat,
        isLoading,
        chats,
        members,
    }
}
