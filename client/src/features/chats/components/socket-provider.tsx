import { SocketContext } from "@/features/chats/socket-context"
import { useEffect, useState, type ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
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
import { useTypingListener } from "@/features/chats/hooks/use-typing"
import { useSidebar } from "@/components/ui/sidebar"
import { toast } from "sonner"
import { getChatName } from "@/features/chats/utils/chats"
import { useUser } from "@/features/auth/use-user"
import { fetchChats } from "@/features/chats/requests"

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

    const user = useUser()
    const queryClient = useQueryClient()
    const params = useParams()
    const currentChannelId = params.id
    const { open } = useSidebar()

    useTypingListener(socket)

    useEffect(() => {
        return () => {
            socket.disconnect()
        }
    }, [socket])

    const { data: chats = [] } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
    })

    useEffect(() => {
        function handleNewMessage(msg: ChatMessage) {
            console.log("new msg :", msg)

            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })

            const isChatOpen = msg.channelId === currentChannelId
            const chat = chats.find((c) => c.id === msg.channelId)

            if (!open && !isChatOpen && chat) {
                toast.info(`new message from ${getChatName(chat, user.id)}`, {
                    description: msg.content,
                })
            }

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
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }

        socket.on("new_members", handleNewMembers)
        socket.on("request_accepted", handleRequestAccepted)
        socket.on("friend_request", handleFriendRequest)
        socket.on("new_message", handleNewMessage)
        socket.on("user_status_changed", statusChangeHandler)
        socket.on("message_delivered", handleDeliveredMessage)
        socket.on("chat_seen", handleSeenChat)
        socket.on("message_deleted", handleDeletedMessage)

        return () => {
            socket.off("new_members", handleNewMembers)
            socket.off("request_accepted", handleRequestAccepted)
            socket.off("friend_request", handleFriendRequest)
            socket.off("new_message", handleNewMessage)
            socket.off("user_status_changed", statusChangeHandler)
            socket.off("message_delivered", handleDeliveredMessage)
            socket.off("chat_seen", handleSeenChat)
            socket.off("message_deleted", handleDeletedMessage)
        }
    }, [socket, queryClient, currentChannelId, user, open, chats])

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
