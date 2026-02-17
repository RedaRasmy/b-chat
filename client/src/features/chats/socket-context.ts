import { createContext } from "react"
import type { Socket } from "socket.io-client"
import type {
    ServerToClientEvents,
    ClientToServerEvents,
} from "@bchat/shared/events"

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export type SocketContext = {
    socket: ClientSocket
}

export const SocketContext = createContext<SocketContext | null>(null)
