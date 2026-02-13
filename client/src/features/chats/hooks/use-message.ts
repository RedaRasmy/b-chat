import { useUser } from "@/features/auth/use-user"
import { useSocket } from "@/features/chats/use-socket"
import type {
    Channels,
    ClientMessage,
    MessageAck,
    OtherUser,
    SendMessageData,
} from "@bchat/types"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"

export function useMessage(channelId: string, members: OtherUser[]) {
    const queryClient = useQueryClient()
    const socket = useSocket()
    const user = useUser()
    const [message, setMessage] = useState("")

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

    const send = useCallback(() => {
        if (message.length > 0) {
            const sentAt = Date.now()
            const tempId = `temp-${sentAt}`

            const tempMessage: ClientMessage = {
                id: tempId,
                content: message,
                createdAt: new Date(),
                senderId: user.id,
                channelId: channelId,
                updatedAt: new Date(),
                status: "sending",
                receipts: members
                    .filter((m) => m.id !== user.id)
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
                    content: message,
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
            setMessage("")
        }
    }, [channelId, handleAck, message, socket, user, queryClient, members])

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

    return {
        message,
        setMessage,
        send,
        retry,
    }
}
