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
    console.log(isLoading)

    console.log(chats)

    const chat = chats ? chats.find((c) => c.id === channelId) : undefined
    console.log(chat)

    const members: Map<string, OtherUser> = useMemo(() => {
        if (!chat || chat.type === "dm") return new Map()
        return new Map(chat.members.map((m) => [m.id, m]))
    }, [chat])

    const chatName = chat?.type === "dm" ? chat.friend.name : chat?.name
    const friend = chat?.type === "dm" ? chat.friend : null

    return {
        chat,
        isLoading,
        chats,
        members,
        chatName,
        friend,
    }
}
