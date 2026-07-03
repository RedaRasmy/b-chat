import type { ClientSocket } from "@/features/chats/types"
import { createContext } from "react"

export type SocketContext = {
    socket: ClientSocket
}

export const SocketContext = createContext<SocketContext | null>(null)
