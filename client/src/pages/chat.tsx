import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/use-auth"
import Message from "@/features/chats/components/message"
import { useTyping } from "@/features/chats/hooks/use-typing"
import { useMessage } from "@/features/chats/hooks/use-message"
import { fetchChats } from "@/features/chats/requests"
import { cn } from "@/lib/utils"
import LoadingPage from "@/pages/loading"
import type { OtherUser } from "@bchat/types"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useChatMessages } from "@/features/chats/hooks/use-chat-messages"

export default function ChatPage() {
    const params = useParams()
    const id = params.id!
    const { user } = useAuth()
    const { sendTyping, isTyping } = useTyping(id)
    const { message, setMessage, send, retry } = useMessage(id)
    const { messages, bottomRef } = useChatMessages(id)

    const { data: chats, isLoading } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
        staleTime: Infinity,
    })

    const membersMap: Map<string, OtherUser> = useMemo(() => {
        if (!chats) return new Map()

        const chat = chats.find((c) => c.id === id)

        if (!chat || chat.type === "dm") return new Map()

        return new Map(chat.members.map((m) => [m.id, m]))
    }, [chats, id])

    if (!chats || isLoading || !user) return <LoadingPage />

    const chat = chats.find((chat) => chat.id === id)

    if (!chat)
        return (
            <div className="h-screen w-full text-3xl flex items-center justify-center">
                Chat Not Found!
            </div>
        )
    const chatName = chat.type === "dm" ? chat.friend.name : chat.name
    const friend = chat.type === "dm" ? chat.friend : null

    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
            <PageHeader>
                <div className="flex items-center gap-3">
                    <h1>{chatName}</h1>
                    {friend && (
                        <span
                            className={cn("text-xs text-muted-foreground ", {
                                "text-primary": friend.status === "online",
                            })}
                        >
                            {friend.status}
                        </span>
                    )}
                </div>
                {isTyping && (
                    <div className="text-xs text-muted-foreground">
                        typing...
                    </div>
                )}
            </PageHeader>
            <main className="p-3 space-y-2 overflow-y-auto relative">
                {messages &&
                    messages.map((msg, i) => (
                        <Message
                            key={i}
                            message={msg}
                            isUser={msg.senderId === user.id}
                            sender={
                                msg.senderId === user.id
                                    ? user
                                    : chat.type === "dm"
                                      ? friend!
                                      : membersMap.get(msg.senderId)!
                            }
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
