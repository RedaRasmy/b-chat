import { Socket, Server } from "socket.io"
import { SOCKET_EVENTS } from "../events"
import logger from "@/lib/logger"
import { channelService } from "@/features/channels/service"
import { userService } from "@/features/users/service"
import { friendService } from "@/features/friendships/service"

export async function handleConnection(io: Server, socket: Socket) {
    const user = socket.user
    logger.info(user, "User connected:")

    await userService.updateStatus(user.id, "online")

    socket.join(`user:${user.id}`)

    const channels = await channelService.getUserChannelsIds(user.id)
    channels.forEach(({ channelId }) => {
        socket.join(`channel:${channelId}`)
    })

    const friendIds = await friendService.getFriendsIds(user.id)
    friendIds.forEach((friendId) => {
        io.to(`user:${friendId}`).emit(SOCKET_EVENTS.USER_STATUS_CHANGED, {
            userId: user.id,
            status: "online",
            lastSeen: new Date(),
        })
    })
}

export async function handleDisconnection(io: Server, socket: Socket) {
    const user = socket.user
    logger.info(user, "User disconnected:")

    try {
        await userService.updateStatus(user.id, "offline")

        const friendIds = await friendService.getFriendsIds(user.id)
        friendIds.forEach((friendId) => {
            io.to(`user:${friendId}`).emit(SOCKET_EVENTS.USER_STATUS_CHANGED, {
                userId: user.id,
                status: "offline",
                lastSeen: new Date(),
            })
        })
    } catch (err) {
        logger.error(err, "Error handling disconnection:")
    }
}
