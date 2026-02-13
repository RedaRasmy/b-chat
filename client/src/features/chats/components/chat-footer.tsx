import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ChatFooter({
    onSend,
    onType,
}: {
    onSend: (msg: string) => void
    onType: () => void
}) {
    const [message, setMessage] = useState("")

    function handleSend() {
        if (message.length > 0) {
            onSend(message)
            setMessage("")
        }
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
                        onType()
                    }
                }}
            />
            <Button onClick={handleSend}> Send</Button>
        </footer>
    )
}
