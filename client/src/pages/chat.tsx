import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/use-auth"
import Message from "@/features/chats/components/message"
import { useMessage } from "@/features/chats/hooks/use-message"
import LoadingPage from "@/pages/loading"
import { useParams } from "react-router-dom"
import { useChatMessages } from "@/features/chats/hooks/use-chat-messages"
import { useChat } from "@/features/chats/hooks/use-chat"
import { getChatAvatar, getChatName } from "@/features/chats/utils/chats"
import Avatar from "@/components/avatar"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteMessage } from "@/features/chats/requests"
import type { ChatMessage, ClientMessage } from "@bchat/types"
import { useSocket } from "@/features/chats/use-socket"
import { ChatSettings } from "@/features/chats/components/chat-settings"

export default function ChatPage() {
    const params = useParams()
    const id = params.id!
    const { user } = useAuth()
    // const { sendTyping, isTyping, typingUser } = useTyping(id)
    const { messages, bottomRef } = useChatMessages(id)
    const { chat, isLoading, members } = useChat(id)
    const { message, setMessage, send, retry } = useMessage(
        id,
        Array.from(members.values()),
    )
    const socket = useSocket()

    const deleteMutation = useMutation({
        mutationFn: deleteMessage,
        // onSuccess: () => {
        //     console.log("deleted")
        // },
        onError: (error) => {
            queryClient.setQueryData(
                ["messages", id],
                (old: ClientMessage[] = []) =>
                    old.map((msg) =>
                        msg.id === id ? { ...msg, status: undefined } : msg,
                    ),
            )
            console.error(error)
        },
    })
    const queryClient = useQueryClient()
    function handleDelete(id: string) {
        queryClient.setQueryData(["messages", id], (old: ChatMessage[] = []) =>
            old.map((msg) =>
                msg.id === id ? { ...msg, status: "sending" } : msg,
            ),
        )
        deleteMutation.mutate(id)
    }

    function sendTyping() {
        if (!user) return

        socket.emit("send_typing", {
            channelId: id,
            userName: user.name,
            userId: user.id,
        })
    }

    if (isLoading || !user) return <LoadingPage />

    if (!chat)
        return (
            <div className="h-screen w-full text-3xl flex items-center justify-center">
                Chat Not Found!
            </div>
        )

    const chatName = getChatName(chat, user.id)
    const chatAvatar = getChatAvatar(chat, user.id)

    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
            <PageHeader>
                <div className="flex items-center gap-2">
                    <Avatar
                        data={{
                            id: chat.id,
                            name: chatName,
                            avatar: chatAvatar,
                        }}
                    />
                    <h1>{chatName}</h1>
                    {/* {friend && (
                        <span
                            className={cn("text-xs text-muted-foreground ", {
                                "text-primary": friend.status === "online",
                            })}
                        >
                            {friend.status}
                        </span>
                    )} */}
                </div>
                <div className="flex gap-2 items-center">
                    {chat.typingUser && (
                        <div className="text-xs text-muted-foreground">
                            {chat.type === "group" && (
                                <span>
                                    <span className="text-primary">
                                        {chat.typingUser}
                                    </span>{" "}
                                    is
                                </span>
                            )}{" "}
                            typing...
                        </div>
                    )}
                    <ChatSettings chat={chat} chatName={chatName} />
                </div>
            </PageHeader>
            <main className="p-3 space-y-2 overflow-y-auto relative">
                {messages &&
                    messages.map((msg, i) => (
                        <Message
                            onDelete={handleDelete}
                            key={i}
                            message={msg}
                            isUser={msg.senderId === user.id}
                            sender={members.get(msg.senderId)!}
                            onRetry={retry}
                        />
                    ))}
                <div ref={bottomRef} />
            </main>
            <footer className="bg- h-12 p-2 border-t flex items-center justify-center gap-1">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="max-w-150"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            send()
                        } else {
                            sendTyping()
                        }
                    }}
                />
                <Button onClick={send}> Send</Button>
            </footer>
        </div>
    )
}
