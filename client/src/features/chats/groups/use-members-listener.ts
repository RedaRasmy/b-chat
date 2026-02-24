import { useSocketListener } from "@/features/chats/hooks/use-socket-listener"
import { useQueryClient } from "@tanstack/react-query"

export default function useMembersListener() {
    const queryClient = useQueryClient()

    useSocketListener("new_members", () => {
        console.log("new members")
        queryClient.invalidateQueries({
            queryKey: ["chats"],
        })
    })
    useSocketListener("member_left", (data) => {
        console.log("member left : ", data)
        queryClient.invalidateQueries({
            queryKey: ["chats"],
        })
    })
    useSocketListener("member_deleted", (data) => {
        console.log("member deleted : ", data)
        queryClient.invalidateQueries({
            queryKey: ["chats"],
        })
    })

    useSocketListener("role_changed", (data) => {
        console.log("role changed : ", data)
        queryClient.invalidateQueries({
            queryKey: ["chats"],
        })
    })
}
