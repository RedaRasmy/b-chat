import { SocketContext } from "@/chats/socket-context"
import { useAuth } from "@/features/auth/use-auth"
import { useEffect, useState, type ReactNode } from "react"
import { io, Socket } from "socket.io-client"

export default function SocketProvider({ children }: { children: ReactNode }) {
    const [socket] = useState<Socket>(() => {
        const newSocket = io("ws://localhost:3000", {
            autoConnect: false,
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

    const { isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated) {
            socket.connect()
        } else {
            socket.disconnect()
        }

        return () => {
            socket.disconnect()
        }
    }, [socket, isAuthenticated])

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
