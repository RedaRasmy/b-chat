import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/use-auth"
import Message from "@/features/chats/components/message"
import { fetchChats, fetchMessages } from "@/features/chats/requests"
import { useSocket } from "@/features/chats/use-socket"
import { cn } from "@/lib/utils"
import LoadingPage from "@/pages/loading"
import type { SeeChatData } from "@bchat/shared/validation"
import type { OtherUser, TypingData } from "@bchat/types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"

export default function ChatPage() {
    const params = useParams()
    const bottomRef = useRef<HTMLDivElement>(null)
    const id = params.id!
    const { user } = useAuth()
    const [message, setMessage] = useState("")
    const socket = useSocket()
    const typingTimeoutRef = useRef<number | null>(null)
    const [typer, setTyper] = useState<string | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
    })

    const membersMap: Map<string, OtherUser> = useMemo(() => {
        const chat = data?.find((c) => c.id === id)

        if (!chat || chat.type === "dm") return new Map()

        return new Map(chat.members.map((m) => [m.id, m]))
    }, [data, id])

    const { data: messages = [] } = useQuery({
        queryKey: ["messages", id],
        queryFn: () => fetchMessages(id),
        staleTime: Infinity,
    })

    useEffect(() => {
        bottomRef.current?.scrollIntoView()
    }, [messages])

    useEffect(() => {
        const readData: SeeChatData = {
            channelId: id,
        }
        socket.emit("see_chat", readData)
    }, [socket, id, messages])

    useEffect(() => {
        function typingHandler(data: TypingData) {
            if (!user || data.userId === user.id) return

            setTyper(data.userName)

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
            typingTimeoutRef.current = setTimeout(() => {
                setTyper(null)
            }, 1000)
        }
        socket.on("new_typing", typingHandler)

        return () => {
            socket.off("new_typing", typingHandler)
        }
    }, [socket, user])

    function handleSend() {
        if (message.length > 0) {
            const sentAt = Date.now()
            socket.emit("send_message", {
                channelId: id,
                content: message,
                sentAt,
            })
            setMessage("")
        }
    }
    function handleTyping() {
        if (!user) return

        socket.emit("send_typing", {
            channelId: id,
            userName: user.name,
            userId: user.id,
        })
    }

    if (!data || isLoading || !user) return <LoadingPage />

    const chat = data.find((chat) => chat.id === id)!
    const chatName = chat.type === "dm" ? chat.friend.name : "group"
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
                {typer && (
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
                            handleSend()
                        } else {
                            handleTyping()
                        }
                    }}
                />
                <Button onClick={handleSend}> Send</Button>
            </footer>
        </div>
    )
}
