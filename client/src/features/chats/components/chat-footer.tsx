import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/features/auth/use-user"
import { useChat } from "@/features/chats/hooks/use-chat"
import { useMessage } from "@/features/chats/hooks/use-message"
import { useSocket } from "@/features/chats/use-socket"
import { useState } from "react"

export default function ChatFooter() {
    const [message, setMessage] = useState("")
    const socket = useSocket()
    const { send } = useMessage()
    const user = useUser()
    const { chat } = useChat()

    function handleSend() {
        if (message.length > 0) {
            send(message)
            setMessage("")
        }
    }

    function sendTyping() {
        socket.emit("send_typing", {
            channelId: chat.id,
            userName: user.name,
            userId: user.id,
        })
    }

    return (
        <footer className="bg- h-12 p-2 border-t flex items-center justify-center gap-1">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="max-w-150"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSend()
                    } else {
                        sendTyping()
                    }
                }}
                aria-label="Message"
            />
            <Button onClick={handleSend}>Send</Button>
        </footer>
    )
}
