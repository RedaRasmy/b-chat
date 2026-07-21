import { Server as HTTPServer } from "http"
import { Server as SocketIOServer, Socket, DefaultEventsMap } from "socket.io"
import { socketAuthMiddleware } from "./middlewares/auth"
import {
    handleConnection,
    handleDisconnection,
} from "./handlers/connection.handler"
import { handleSendMessage } from "./handlers/message.handler"
import { handleGetMessage, handleSeeChat } from "./handlers/receipt.handler"
import { handleTyping } from "./handlers/typing.handler"
import {
    Args,
    ClientToServerEvents,
    ServerEvent,
    ServerToClientEvents,
} from "@bchat/shared/events"
import { allowedOrigins } from "@/config/allowed-origins"
import { Profile } from "@bchat/types"
import logger from "@/lib/logger"
import { handleSyncMessages } from "@/socket/handlers/sync.handler"
import { handleJoinChannel } from "@/socket/handlers/join-handler"

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

export function getUserSocket(userId: string) {
    console.log("getUserSocket runs")
    const sockets = Array.from(getIO().sockets.sockets.values())

    const socketsNum = sockets.filter((s) => s.data.user.id === userId).length

    logger.info(`There is ${socketsNum} sockets for the same user`)
    if (socketsNum > 1) {
        logger.warn("There is multiple sockets for the same user")
    }

    return sockets.find((s) => s.data.user.id === userId)
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
