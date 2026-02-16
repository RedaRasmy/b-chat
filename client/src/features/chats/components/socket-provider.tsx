import { SocketContext } from "@/features/chats/socket-context"
import { useEffect, useState, type ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query"
import type { Channels, Friend, Member, StatusChangeData } from "@bchat/types"
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
        function statusChangeHandler(data: StatusChangeData) {
            console.log("status change : ", data)
            queryClient.setQueryData(["friends"], (old: Friend[] = []) => {
                return old.map((friend) => {
                    if (friend.id === data.userId) {
                        return {
                            ...friend,
                            status: data.status,
                            lastSeen: data.lastSeen,
                        }
                    } else {
                        return friend
                    }
                })
            })
            queryClient.setQueryData(["chats"], (old: Channels = []) =>
                old.map((chat) => {
                    if (chat.type === "group") return chat
                    const friend = chat.members.find(
                        (mem) => mem.id === data.userId,
                    )!
                    if (!friend) return chat
                    return {
                        ...chat,
                        status: data.status,
                        lastSeen: data.lastSeen,
                    }
                }),
            )
        }

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
        socket.on("user_status_changed", statusChangeHandler)

        return () => {
            socket.off("role_changed", handleRoleChanged)
            socket.off("member_left", handleMemberLeft)
            socket.off("member_deleted", handleMemberDeleted)
            socket.off("new_members", handleNewMembers)
            socket.off("request_accepted", handleRequestAccepted)
            socket.off("friend_request", handleFriendRequest)
            socket.off("user_status_changed", statusChangeHandler)
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
