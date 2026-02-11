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
import type {
    ChatSeenData,
    MessageDeliveredData,
} from "@bchat/shared/validation"

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

    const { isAuthenticated, user } = useAuth()
    const queryClient = useQueryClient()
    const params = useParams()
    const currentChannelId = params.id

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
        if (!user) return

        function handleNewMessage(msg: ChatMessage) {
            console.log("new msg :", msg)

            queryClient.setQueryData(["chats"], (old: Channels = []) => {
                if (!old.find((chat) => chat.id === msg.channelId)) {
                    console.log("invalidate chats")
                    queryClient.invalidateQueries({
                        queryKey: ["chats"],
                    })
                    return old
                }
                return old.map((chat) => {
                    if (chat.id !== msg.channelId) return chat
                    const isChatOpen = chat.id === currentChannelId
                    return {
                        ...chat,
                        lastMessage: {
                            ...msg,
                            seenAt: isChatOpen ? new Date() : null,
                        },
                        isNew: isChatOpen === false,
                    }
                })
            })

            if (user && msg.senderId !== user.id) {
                queryClient.setQueryData(
                    ["messages", msg.channelId],
                    (old: ChatMessage[] = []) => [...old, msg],
                )
                socket.emit("get_message", {
                    messageId: msg.id,
                    channelId: msg.channelId,
                    senderId: msg.senderId,
                })
            }
        }
        function statusChangeHandler(data: StatusChangeData) {
            console.log("status change : ", data)
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

            queryClient.setQueryData(["chats"], (old: Channels = []) => {
                return old.map((chat) => {
                    if (chat.type === "dm" && data.userId == chat.friend.id)
                        return {
                            ...chat,
                            friend: {
                                ...chat.friend,
                                status: data.status,
                                lastSeen: data.lastSeen,
                            },
                        }
                    return chat
                })
            })
        }

        function handleDeliveredMessage({
            channelId,
            deliveredAt,
            messageId,
            receiverId,
        }: MessageDeliveredData) {
            console.log("message is delivered")
            queryClient.setQueryData(
                ["messages", channelId],
                (old: ChatMessage[] = []) =>
                    old.map((msg) => {
                        if (msg.id !== messageId) return msg
                        return {
                            ...msg,
                            deliveredAt,
                            receipts: msg.receipts
                                ? msg.receipts.map((rec) =>
                                      rec.userId === receiverId
                                          ? {
                                                ...rec,
                                                deliveredAt,
                                            }
                                          : rec,
                                  )
                                : msg.receipts,
                        }
                    }),
            )
        }

        function handleSeenChat({
            messageId,
            seenAt,
            channelId,
            userId,
        }: ChatSeenData) {
            console.log("chat is seen")
            queryClient.setQueryData(
                ["messages", channelId],
                (old: ChatMessage[] = []) =>
                    old.map((msg) => {
                        if (msg.id !== messageId) return msg
                        return {
                            ...msg,
                            seenAt,
                            receipts: msg.receipts
                                ? msg.receipts.map((rec) =>
                                      rec.userId === userId
                                          ? {
                                                ...rec,
                                                seenAt,
                                            }
                                          : rec,
                                  )
                                : msg.receipts,
                        }
                    }),
            )
        }

        socket.on("new_message", handleNewMessage)
        socket.on("user_status_changed", statusChangeHandler)
        socket.on("message_delivered", handleDeliveredMessage)
        socket.on("chat_seen", handleSeenChat)

        return () => {
            socket.off("new_message", handleNewMessage)
            socket.off("user_status_changed", statusChangeHandler)
            socket.off("message_delivered", handleDeliveredMessage)
            socket.off("chat_seen", handleSeenChat)
        }
    }, [socket, queryClient, currentChannelId, user])

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
