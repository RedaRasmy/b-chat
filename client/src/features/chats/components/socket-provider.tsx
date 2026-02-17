import { SocketContext } from "@/features/chats/socket-context"
import { useEffect, useState, type ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import type {
    ServerToClientEvents,
    ClientToServerEvents,
} from "@bchat/shared/events"

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export default function SocketProvider({ children }: { children: ReactNode }) {
    const [socket] = useState<ClientSocket>(() => {
        const newSocket = io("ws://localhost:3000", {
            withCredentials: true,
        })

        newSocket.on("connect", () => {
            console.log("Connected")
        })

        newSocket.on("disconnect", (reason) => {
            console.warn("Disconnected:", reason)
        })

        newSocket.on("connect_error", (error) => {
            console.error("Connection Error:", error)
        })

        return newSocket
    })

    useEffect(() => {
        return () => {
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
