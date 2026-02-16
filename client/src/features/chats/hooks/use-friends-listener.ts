import { useSocket } from "@/features/chats/use-socket"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"

export default function useFriendsListener() {
    const queryClient = useQueryClient()
    const socket = useSocket()

    useEffect(() => {
        function handleFriendRequest({ userName }: { userName: string }) {
            queryClient.invalidateQueries({
                queryKey: ["requests"],
            })
            toast.info(`${userName} sent you a friend request`)
        }

        function handleRequestAccepted({ userName }: { userName: string }) {
            queryClient.invalidateQueries({
                queryKey: ["sent-requests"],
            })
            queryClient.invalidateQueries({
                queryKey: ["friends"],
            })
            toast.info(`${userName} accepted your friend request`)
        }

        socket.on("request_accepted", handleRequestAccepted)
        socket.on("friend_request", handleFriendRequest)

        return () => {
            socket.off("request_accepted", handleRequestAccepted)
            socket.off("friend_request", handleFriendRequest)
        }
    }, [socket, queryClient])
}
