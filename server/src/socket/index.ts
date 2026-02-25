import { Server as HTTPServer } from "http"
import { Server as SocketIOServer, Socket } from "socket.io"
import { socketAuthMiddleware } from "./middlewares/auth"
import {
    handleConnection,
    handleDisconnection,
} from "./handlers/connection.handler"
import { handleSendMessage } from "./handlers/message.handler"
import { handleGetMessage, handleSeeChat } from "./handlers/receipt.handler"
import { handleTyping } from "./handlers/typing.handler"
import {
    ClientToServerEvents,
    ServerEvent,
    ServerPayloads,
    ServerToClientEvents,
} from "@bchat/shared/events"
import { allowedOrigins } from "@/config/allowed-origins"

export type TypedServer = SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents
>
export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>

let io: TypedServer

export function setupSocketIO(server: HTTPServer) {
    io = new SocketIOServer(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    })

    io.use(socketAuthMiddleware)

    io.on("connection", async (socket) => {
        await handleConnection(io, socket)

        socket.on("send_message", handleSendMessage(io, socket))
        socket.on("get_message", handleGetMessage(io, socket))
        socket.on("see_chat", handleSeeChat(io, socket))
        socket.on("send_typing", handleTyping(io, socket))
        socket.on("disconnect", () => handleDisconnection(io, socket))
    })

    return io
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!")
    }
    return io
}

export function getUserSocket(userId: string) {
    const sockets = Array.from(getIO().sockets.sockets.values())
    return sockets.find((s) => s.user.id === userId)
}

function getTypedIO() {
    return getIO() as any
}

export function emitToUser<T extends ServerEvent>(
    userId: string,
    event: T,
    data: ServerPayloads[T],
) {
    getTypedIO().to(`user:${userId}`).emit(event, data)
}

export function emitToChannel<T extends ServerEvent>(
    channelId: string,
    event: T,
    data: ServerPayloads[T],
) {
    getTypedIO().to(`channel:${channelId}`).emit(event, data)
}
