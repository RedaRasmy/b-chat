import { useUser } from "@/features/auth/use-user"
import { useChat } from "@/features/chats/hooks/use-chat"
import { deleteMessage } from "@/features/chats/requests"
import { useSocket } from "@/features/chats/use-socket"
import type {
    Channels,
    ClientMessage,
    MessageAck,
    SendMessageData,
} from "@bchat/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export function useMessage() {
    const queryClient = useQueryClient()
    const socket = useSocket()
    const user = useUser()
    const {
        chat: { id: channelId, members },
    } = useChat()

    const handleAck = useCallback(
        (tempMessage: ClientMessage, res: MessageAck) => {
            if (res.success) {
                queryClient.setQueryData(
                    ["messages", channelId],
                    (old: ClientMessage[] = []) =>
                        old.map((msg) =>
                            msg.id === res.tempId
                                ? {
                                      ...tempMessage,
                                      id: res.messageId,
                                      status: "sent",
                                  }
                                : msg,
                        ),
                )
                queryClient.setQueryData(["chats"], (old: Channels = []) =>
                    old.map((chat) =>
                        chat.id === channelId
                            ? {
                                  ...chat,
                                  lastMessage: {
                                      ...tempMessage,
                                      id: res.messageId,
                                      status: undefined,
                                      receipts: tempMessage.receipts.map(
                                          (r) => ({
                                              ...r,
                                              messageId: res.messageId,
                                          }),
                                      ),
                                  },
                              }
                            : chat,
                    ),
                )
            } else {
                queryClient.setQueryData(
                    ["messages", channelId],
                    (old: ClientMessage[] = []) =>
                        old.map((msg) =>
                            msg.id === res.tempId
                                ? {
                                      ...msg,
                                      status: "failed",
                                  }
                                : msg,
                        ),
                )
                queryClient.setQueryData(["chats"], (old: Channels = []) =>
                    old.map((chat) =>
                        chat.id === channelId
                            ? {
                                  ...chat,
                                  lastMessage: {
                                      ...tempMessage,
                                      status: "failed",
                                  },
                              }
                            : chat,
                    ),
                )
            }
        },
        [channelId, queryClient],
    )

    const send = useCallback(
        (msg: string) => {
            const sentAt = Date.now()
            const tempId = `temp-${sentAt}`

            const tempMessage: ClientMessage = {
                id: tempId,
                content: msg,
                createdAt: new Date(),
                senderId: user.id,
                channelId: channelId,
                updatedAt: new Date(),
                status: "sending",
                receipts: members
                    .filter((m) => m.id !== user.id && m.status === "active")
                    .map((mem) => ({
                        userId: mem.id,
                        messageId: tempId,
                        seenAt: null,
                        deliveredAt: null,
                    })),
            }
            queryClient.setQueryData(
                ["messages", channelId],
                (old: ClientMessage[] = []) => [...old, tempMessage],
            )

            socket.emit(
                "send_message",
                {
                    channelId: channelId,
                    content: msg,
                    tempId,
                } satisfies SendMessageData,
                (res: MessageAck) => {
                    handleAck(tempMessage, res)
                },
            )

            queryClient.setQueryData(["chats"], (old: Channels = []) =>
                old.map((chat) =>
                    chat.id === channelId
                        ? {
                              ...chat,
                              lastMessage: tempMessage,
                          }
                        : chat,
                ),
            )
        },
        [channelId, handleAck, socket, user, queryClient, members],
    )

    const retry = useCallback(
        (message: ClientMessage) => {
            queryClient.setQueryData(
                ["messages", channelId],
                (old: ClientMessage[] = []) =>
                    old.map((msg) =>
                        msg.id === message.id
                            ? { ...msg, status: "sending" }
                            : msg,
                    ),
            )
            queryClient.setQueryData(["chats"], (old: Channels = []) =>
                old.map((chat) =>
                    chat.id === channelId
                        ? {
                              ...chat,
                              lastMessage: {
                                  ...message,
                                  status: "sending",
                              },
                          }
                        : chat,
                ),
            )

            socket.emit(
                "send_message",
                {
                    tempId: message.id,
                    channelId: message.channelId,
                    content: message.content,
                } satisfies SendMessageData,
                (res: MessageAck) => {
                    handleAck(message, res)
                },
            )
        },
        [channelId, handleAck, queryClient, socket],
    )

    const deleteMutation = useMutation({
        mutationFn: deleteMessage,
        onError: (error) => {
            console.error(error)
            queryClient.setQueryData(
                ["messages", channelId],
                (old: ClientMessage[] = []) =>
                    old.map((msg) => ({ ...msg, status: undefined })),
            )
        },
    })

    const remove = useCallback(
        (id: string) => {
            queryClient.setQueryData(
                ["messages", channelId],
                (old: ClientMessage[] = []) =>
                    old.map((msg) =>
                        msg.id === id ? { ...msg, status: "sending" } : msg,
                    ),
            )
            deleteMutation.mutate(id)
        },
        [deleteMutation, queryClient, channelId],
    )

    return {
        send,
        retry,
        remove,
    }
}
