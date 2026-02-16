import { SocketContext } from "@/features/chats/socket-context"
import { useEffect, useState, type ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function SocketProvider({ children }: { children: ReactNode }) {
    const [socket] = useState<Socket>(() => {
        const newSocket = io("ws://localhost:3000", {
            withCredentials: true,
        })

        newSocket.on("connect", () => {
            console.log("Connected")
        })

        newSocket.on("disconnect", (reason) => {
            console.warn("Disconnected:", reason)
        })

        newSocket.on("connect_error", (error) => {
            console.error("Connection Error:", error)
        })

        return newSocket
    })

    const queryClient = useQueryClient()

    useEffect(() => {
        return () => {
            socket.disconnect()
        }
    }, [socket])

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

    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}
