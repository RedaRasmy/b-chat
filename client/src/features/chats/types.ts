import type { Socket } from "socket.io-client"
import type {
    ServerToClientEvents,
    ClientToServerEvents,
} from "@bchat/shared/events"

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>
