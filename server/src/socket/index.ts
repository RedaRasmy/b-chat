import { Server as HTTPServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { allowedOrigins } from "../app"
import { socketAuthMiddleware } from "./middlewares/auth"
import { CLIENT_EVENTS, ServerEvent, SOCKET_EVENTS } from "./events"
import {
    handleConnection,
    handleDisconnection,
} from "./handlers/connection.handler"
import { handleSendMessage } from "./handlers/message.handler"
import { handleGetMessage, handleSeeChat } from "./handlers/receipt.handler"
import { handleTyping } from "./handlers/typing.handler"

let io: SocketIOServer

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

        socket.on(CLIENT_EVENTS.SEND_MESSAGE, handleSendMessage(io, socket))
        socket.on(CLIENT_EVENTS.GET_MESSAGE, handleGetMessage(io, socket))
        socket.on(CLIENT_EVENTS.SEE_CHAT, handleSeeChat(io, socket))
        socket.on(CLIENT_EVENTS.SEND_TYPING, handleTyping(io, socket))
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

export function emitToUser(userId: string, event: ServerEvent, data?: any) {
    getIO().to(`user:${userId}`).emit(event, data)
}

export function emitToChannel(
    channelId: string,
    event: ServerEvent,
    data?: any,
) {
    getIO().to(`channel:${channelId}`).emit(event, data)
}
