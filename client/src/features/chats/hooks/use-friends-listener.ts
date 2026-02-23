import { useSocketListener } from "@/features/chats/hooks/use-socket-listener"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function useFriendsListener() {
    const queryClient = useQueryClient()

    useSocketListener("request_accepted", ({ userName }) => {
        queryClient.invalidateQueries({
            queryKey: ["friends"],
        })
        queryClient.invalidateQueries({
            queryKey: ["sent-requests"],
        })
        toast.info(`${userName} accepted your friend request`)
    })

    useSocketListener("friend_request", ({ userName }) => {
        queryClient.invalidateQueries({
            queryKey: ["requests"],
        })
        toast.info(`${userName} sent you a friend request`)
    })
}
