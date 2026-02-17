import logger from "@/lib/logger"
import { channelService } from "@/features/channels/service"
import { userService } from "@/features/users/service"
import { friendService } from "@/features/friendships/service"
import { SERVER_EVENTS } from "@bchat/shared/events"
import { TypedServer, TypedSocket } from "@/socket"

export async function handleConnection(io: TypedServer, socket: TypedSocket) {
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
        io.to(`user:${friendId}`).emit(SERVER_EVENTS.USER_STATUS_CHANGED, {
            userId: user.id,
            status: "online",
            lastSeen: new Date(),
        })
    })
}

export async function handleDisconnection(
    io: TypedServer,
    socket: TypedSocket,
) {
    const user = socket.user
    logger.info(user, "User disconnected:")

    try {
        await userService.updateStatus(user.id, "offline")

        const friendIds = await friendService.getFriendsIds(user.id)
        friendIds.forEach((friendId) => {
            io.to(`user:${friendId}`).emit(SERVER_EVENTS.USER_STATUS_CHANGED, {
                userId: user.id,
                status: "offline",
                lastSeen: new Date(),
            })
        })
    } catch (err) {
        logger.error(err, "Error handling disconnection:")
    }
}
