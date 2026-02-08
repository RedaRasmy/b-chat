import { SocketContext } from "@/features/chats/socket-context"
import { useAuth } from "@/features/auth/use-auth"
import { useEffect, useState, type ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import type {
    Channels,
    ChatMessage,
    Friend,
    StatusChangeData,
} from "@bchat/types"

export default function SocketProvider({ children }: { children: ReactNode }) {
    const [socket] = useState<Socket>(() => {
        const newSocket = io("ws://localhost:3000", {
            autoConnect: false,
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

    const { isAuthenticated } = useAuth()
    const queryClient = useQueryClient()
    const currentChannelId = useParams().id

    useEffect(() => {
        if (isAuthenticated) {
            socket.connect()
        } else {
            socket.disconnect()
        }

        return () => {
            socket.disconnect()
        }
    }, [socket, isAuthenticated])

    useEffect(() => {
        function handleNewMessage(msg: ChatMessage) {
            console.log("New message received", msg)

            // queryClient.setQueryData(["chats"], (old: Channels) => {
            //     return {
            //         ...old,
            //         dms: old.dms.map((dm) =>
            //             dm.id === msg.channelId
            //                 ? {
            //                       ...dm,
            //                       //   lastMessage: msg.content,
            //                       //   unreadCount:
            //                       //       dm.id !== currentChannelId
            //                       //           ? (dm.unreadCount || 0) + 1
            //                       //           : 0,
            //                   }
            //                 : dm,
            //         ),
            //     }
            // })

            // if (msg.channelId !== currentChannelId) {
            //     showNotification({
            //         title: msg.senderName,
            //         body: msg.content,
            //         channelId: msg.channelId,
            //     })
            // }

            queryClient.setQueryData(
                ["messages", msg.channelId],
                (old: ChatMessage[] = []) => [...old, msg],
            )
        }
        function statusChangeHandler(data: StatusChangeData) {
            queryClient.setQueryData(["friends"], (old: Friend[]) => {
                if (old)
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

            queryClient.setQueryData(["chats"], (old: Channels) => {
                if (old)
                    return {
                        ...old,
                        dms: old.dms.map((dm) =>
                            dm.friend.id === data.userId
                                ? {
                                      ...dm,
                                      friend: {
                                          ...dm.friend,
                                          status: data.status,
                                          lastSeen: data.lastSeen,
                                      },
                                  }
                                : dm,
                        ),
                    }
            })
        }

        socket.on("user_status_changed", statusChangeHandler)
        socket.on("new_message", handleNewMessage)

        return () => {
            socket.off("new_message", handleNewMessage)
            socket.off("user_status_changed", statusChangeHandler)
        }
    }, [socket, queryClient, currentChannelId])

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
