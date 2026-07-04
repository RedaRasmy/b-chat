import { fetchChats } from "@/features/chats/requests"
import { useQuery } from "@tanstack/react-query"

export function useChats() {
    return useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
        staleTime: Infinity,
    })
}
