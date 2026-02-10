import { useAuth } from "@/features/auth/use-auth"
import { useSocket } from "@/features/chats/use-socket"
import type { TypingData } from "@bchat/types"
import { useCallback, useEffect, useRef, useState } from "react"

export function useTyping(channelId: string) {
    const typingTimeoutRef = useRef<number | null>(null)
    const [typer, setTyper] = useState<string | null>(null)
    const socket = useSocket()
    const { user } = useAuth()

    useEffect(() => {
        function typingHandler(data: TypingData) {
            if (data.channelId !== channelId) return
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
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [socket, user, channelId])

    const sendTyping = useCallback(() => {
        if (!user) return

        socket.emit("send_typing", {
            channelId,
            userName: user.name,
            userId: user.id,
        })
    }, [socket, user, channelId])

    return {
        sendTyping,
        typingUser: typer,
        isTyping: typer !== null,
    }
}
