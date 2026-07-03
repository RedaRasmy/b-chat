import { SocketContext } from "@/features/chats/socket-context"
import { useEffect, useState, type ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import type {
    ServerToClientEvents,
    ClientToServerEvents,
} from "@bchat/shared/events"

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>

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
