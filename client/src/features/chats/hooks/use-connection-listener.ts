import { useSocket } from "@/features/chats/hooks/use-socket"
import type { Channels } from "@bchat/types"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export function useConnectionListener() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        const onConnect = () => {
            const chats = queryClient.getQueryData<Channels>(["chats"])

            if (!chats || chats.length === 0) {
                console.log("Skipping sync: Chats cache is empty or loading.")
                return
            }

            const highestOrder = Math.max(
                ...chats.map((c) => c.lastMessage?.order ?? 0),
                0,
            )

            console.log("sync messages...")
            socket.emit("sync_messages", highestOrder)
        }

        socket.on("connect", onConnect)

        return () => {
            socket.off("connect", onConnect)
        }
    }, [socket, queryClient])
}
