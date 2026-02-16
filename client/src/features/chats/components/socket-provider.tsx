import { SocketContext } from "@/features/chats/socket-context"
import { useEffect, useState, type ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query"
import type { Member } from "@bchat/types"
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

        function handleNewMembers() {
            console.log("new members")
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }
        function handleMemberLeft(data: { userId: string; userName: string }) {
            console.log("member left : ", data)
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }
        function handleMemberDeleted(data: {
            userId: string
            userName: string
        }) {
            console.log("member deleted : ", data)
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }
        function handleRoleChanged(data: {
            userId: string
            userName: string
            oldRole: Member["role"]
            newRole: Member["role"]
        }) {
            console.log("role changed : ", data)
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }

        socket.on("role_changed", handleRoleChanged)
        socket.on("member_left", handleMemberLeft)
        socket.on("member_deleted", handleMemberDeleted)
        socket.on("new_members", handleNewMembers)
        socket.on("request_accepted", handleRequestAccepted)
        socket.on("friend_request", handleFriendRequest)

        return () => {
            socket.off("role_changed", handleRoleChanged)
            socket.off("member_left", handleMemberLeft)
            socket.off("member_deleted", handleMemberDeleted)
            socket.off("new_members", handleNewMembers)
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
