import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/use-auth"
import Message from "@/features/chats/components/message"
import { fetchChats, fetchMessages } from "@/features/chats/requests"
import { useSocket } from "@/features/chats/use-socket"
import { cn } from "@/lib/utils"
import LoadingPage from "@/pages/loading"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

export default function ChatPage() {
    const params = useParams()
    const bottomRef = useRef<HTMLDivElement>(null)
    const id = params.id!
    const { user } = useAuth()
    const [message, setMessage] = useState("")
    const socket = useSocket()

    const { data, isLoading } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
    })

    const { data: messages = [] } = useQuery({
        queryKey: ["messages", id],
        queryFn: () => fetchMessages(id),
        staleTime: Infinity,
    })

    useEffect(() => {
        bottomRef.current?.scrollIntoView()
    }, [messages])

    useEffect(() => {
        socket.emit("mark_read", { channelId: id })
    }, [socket, id])

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
            user: user.name,
        })
    }

    if (!data || isLoading || !user) return <LoadingPage />

    const chat = data.dms.find((dm) => dm.id === id)!
    const friend = chat.friend

    console.log(chat)

    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
            <PageHeader>
                <div className="flex items-center gap-3">
                    <h1>{friend.name}</h1>
                    <span
                        className={cn("text-xs text-muted-foreground ", {
                            "text-primary": friend.status === "online",
                        })}
                    >
                        {friend.status}
                    </span>
                </div>
            </PageHeader>
            <main className="p-3 space-y-2 overflow-y-auto">
                {messages &&
                    messages.map((msg, i) => (
                        <Message
                            key={i}
                            message={msg}
                            isUser={msg.senderId === user.id}
                            sender={
                                msg.senderId === user.id ? user : chat.friend
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
