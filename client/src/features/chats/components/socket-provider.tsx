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
    MessageDeletedData,
    StatusChangeData,
} from "@bchat/types"
import type {
    ChatSeenData,
    MessageDeliveredData,
} from "@bchat/shared/validation"
import { useTyping } from "@/features/chats/hooks/use-typing"

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
    useTyping(socket)

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
            if (!user) {
                console.warn("User not defined")
                return
            }

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
                            receipts: msg.receipts.map((rec) =>
                                rec.userId === user.id && isChatOpen
                                    ? { ...rec, seenAt: new Date() }
                                    : rec,
                            ),
                        },
                    }
                })
            })

            if (msg.senderId !== user.id) {
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
                            receipts: msg.receipts.map((rec) =>
                                rec.userId === receiverId
                                    ? {
                                          ...rec,
                                          deliveredAt,
                                      }
                                    : rec,
                            ),
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

        function handleDeletedMessage({
            channelId,
            messageId,
        }: MessageDeletedData) {
            queryClient.setQueryData(["chats"], (old: Channels = []) =>
                old.map((chat) =>
                    chat.id === channelId
                        ? {
                              ...chat,
                              lastMessage: chat.lastMessage
                                  ? chat.lastMessage.id === messageId
                                      ? null
                                      : chat.lastMessage
                                  : null,
                          }
                        : chat,
                ),
            )
            queryClient.setQueryData(
                ["messages", channelId],
                (old: ChatMessage[] = []) =>
                    old.filter((msg) => msg.id !== messageId),
            )
        }

        socket.on("new_message", handleNewMessage)
        socket.on("user_status_changed", statusChangeHandler)
        socket.on("message_delivered", handleDeliveredMessage)
        socket.on("chat_seen", handleSeenChat)
        socket.on("message_deleted", handleDeletedMessage)

        return () => {
            socket.off("new_message", handleNewMessage)
            socket.off("user_status_changed", statusChangeHandler)
            socket.off("message_delivered", handleDeliveredMessage)
            socket.off("chat_seen", handleSeenChat)
            socket.off("message_deleted", handleDeletedMessage)
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
