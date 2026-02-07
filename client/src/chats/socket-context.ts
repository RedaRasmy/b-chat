import { createContext } from "react"
import type { Socket } from "socket.io-client"

export type SocketContext = {
    socket: Socket
}

export const SocketContext = createContext<SocketContext | null>(null)
