import { fetchChats, fetchMessages } from "@/features/chats/requests"
import { useQuery } from "@tanstack/react-query"

export function useChats() {
    return useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
        staleTime: Infinity,
    })
}

export function useMessages(channelId: string) {
    return useQuery({
        queryKey: ["messages", channelId],
        queryFn: () => fetchMessages(channelId),
        staleTime: Infinity,
    })
}
