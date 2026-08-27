import { SocketContext } from "@/features/chats/socket-context"
import type { ClientSocket } from "@/features/chats/types"
import { useEffect, useState, type ReactNode } from "react"
import { io } from "socket.io-client"

export default function SocketProvider({ children }: { children: ReactNode }) {
    const [socket] = useState<ClientSocket>(() =>
        io(import.meta.env.DEV ? import.meta.env.VITE_API_URL : "/", {
            withCredentials: true,
        }),
    )

    useEffect(() => {
        const onConnect = () => console.log("Connected")
        const onDisconnect = (reason: string) =>
            console.warn("Disconnected:", reason)
        const onConnectError = (error: Error) =>
            console.error("Connection Error:", error)

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("connect_error", onConnectError)

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("connect_error", onConnectError)
            socket.disconnect()
        }
    }, [socket])

    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}
