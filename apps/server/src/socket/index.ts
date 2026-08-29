import { Server as HTTPServer } from "http"
import { Server as SocketIOServer, Socket, DefaultEventsMap } from "socket.io"
import { socketAuthMiddleware } from "./middlewares/auth.js"
import { handleConnection, handleDisconnection } from "./handlers/connection.handler.js"
import { handleSendMessage } from "./handlers/message.handler.js"
import { handleGetMessage, handleSeeChat } from "./handlers/receipt.handler.js"
import { handleTyping } from "./handlers/typing.handler.js"
import { Args, ClientToServerEvents, ServerEvent, ServerToClientEvents } from "@bchat/shared/events"
import { allowedOrigins } from "@/config/allowed-origins.js"
import { Profile } from "@bchat/shared/types"
import logger from "@/lib/logger.js"
import { handleSyncMessages } from "@/socket/handlers/sync.handler.js"
import { handleJoinChannel } from "@/socket/handlers/join-handler.js"

export type TypedServer = SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    {
        user: Profile
    }
>
export type TypedSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    {
        user: Profile
    }
>

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
        await handleConnection(socket)

        socket.on("send_message", handleSendMessage(socket))
        socket.on("sync_messages", handleSyncMessages(socket))
        socket.on("get_message", handleGetMessage(socket))
        socket.on("see_chat", handleSeeChat(socket))
        socket.on("send_typing", handleTyping(socket))
        socket.on("join_channel", handleJoinChannel(socket))
        socket.on("disconnect", () => handleDisconnection(socket))

        socket.onAny((event) => {
            if (socket.listeners(event).length === 0) {
                logger.warn(`missing handler for ${event} event`)
            }
        })
    })

    return io
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!")
    }
    return io
}

export function leaveChannel(userId: string, channelId: string) {
    getIO().in(`user:${userId}`).socketsLeave(`channel:${channelId}`)
}

export function emitToUsers<T extends ServerEvent>(
    ids: string[] | string,
    event: T,
    ...args: Args<T>
) {
    const io = getIO()

    if (typeof ids === "string") {
        io.to(`user:${ids}`).emit(event, ...args)
    } else {
        ids.forEach((id) => {
            io.to(`user:${id}`).emit(event, ...args)
        })
    }
}

export function emitToChannel<T extends ServerEvent>(
    channelId: string,
    event: T,
    ...args: Args<T>
) {
    getIO()
        .to(`channel:${channelId}`)
        .emit(event, ...args)
}
