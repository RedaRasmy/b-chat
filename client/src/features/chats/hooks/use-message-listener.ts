import { useSidebar } from "@/components/ui/sidebar"
import { useUser } from "@/features/auth/use-user"
import { fetchChats } from "@/features/chats/requests"
import { useSocket } from "@/features/chats/use-socket"
import { getChatName } from "@/features/chats/utils/chats"
import type {
    Channels,
    ChatMessage,
    ChatSeenData,
    MessageDeletedData,
    MessageDeliveredData,
} from "@bchat/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

export default function useMessageListener() {
    const socket = useSocket()
    const user = useUser()
    const queryClient = useQueryClient()
    const currentChannelId = useParams().id
    const { open } = useSidebar()

    const { data: chats = [] } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
    })

    useEffect(() => {
        function handleNewMessage(message: ChatMessage) {
            console.log("new msg :", message)
            const chat = chats.find((c) => c.id === message.channelId)

            if (chat) {
                queryClient.setQueryData(["chats"], (old: Channels = []) =>
                    old.map((chat) => {
                        if (chat.id !== message.channelId) return chat
                        return {
                            ...chat,
                            lastMessage: {
                                ...message,
                                receipts:
                                    chat.id === currentChannelId
                                        ? message.receipts.map((r) =>
                                              r.userId === user.id
                                                  ? {
                                                        ...r,
                                                        seenAt: new Date(),
                                                    }
                                                  : r,
                                          )
                                        : message.receipts,
                            },
                        }
                    }),
                )
            } else {
                queryClient.invalidateQueries({
                    queryKey: ["chats"],
                })
            }

            const isChatOpen = message.channelId === currentChannelId

            if (!open && !isChatOpen && chat) {
                toast.info(`new message from ${getChatName(chat, user.id)}`, {
                    description: message.content,
                })
            }

            if (message.senderId !== user.id) {
                queryClient.setQueryData(
                    ["messages", message.channelId],
                    (old: ChatMessage[] = []) => [...old, message],
                )
                socket.emit("get_message", {
                    messageId: message.id,
                    channelId: message.channelId,
                    senderId: message.senderId,
                })
            }
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
        socket.on("message_delivered", handleDeliveredMessage)
        socket.on("chat_seen", handleSeenChat)
        socket.on("message_deleted", handleDeletedMessage)

        return () => {
            socket.off("new_message", handleNewMessage)
            socket.off("message_delivered", handleDeliveredMessage)
            socket.off("chat_seen", handleSeenChat)
            socket.off("message_deleted", handleDeletedMessage)
        }
    }, [chats, currentChannelId, queryClient, socket, user.id, open])
}
