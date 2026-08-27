import logger from "@/lib/logger.js"
import { channelService } from "@/features/channels/service.js"
import { userService } from "@/features/users/service.js"
import { friendService } from "@/features/friendships/service.js"
import { emitToUsers, TypedSocket } from "@/socket/index.js"
import { buildHandler } from "@/utils/build-handler.js"

export async function handleConnection(socket: TypedSocket) {
    const user = socket.data.user
    logger.info(user, "User connected:")

    await userService.updateStatus(user.id, "online")

    socket.join(`user:${user.id}`)

    const channels = await channelService.getUserChannelsIds(user.id)
    channels.forEach(({ channelId }) => {
        socket.join(`channel:${channelId}`)
    })

    const friendIds = await friendService.getFriendsIds(user.id)

    emitToUsers(friendIds, "user_status_changed", {
        userId: user.id,
        status: "online",
        lastSeen: new Date(),
    })
}

export async function handleDisconnection(socket: TypedSocket) {
    const user = socket.data.user
    logger.info(user, "User disconnected:")

    try {
        await userService.updateStatus(user.id, "offline")

        const friendIds = await friendService.getFriendsIds(user.id)

        emitToUsers(friendIds, "user_status_changed", {
            userId: user.id,
            status: "offline",
            lastSeen: new Date(),
        })
    } catch (err) {
        logger.error(err, "Error handling disconnection:")
    }
}

// export const handleConnection = buildHandler(
//     async (user, { joinSelf, joinChannels }) => {
//         logger.info(user, "User connected:")

//         try {
//             await userService.updateStatus(user.id, "online")

//             joinSelf()

//             const channels = await channelService.getUserChannelsIds(user.id)

//             joinChannels(channels)

//             const friendIds = await friendService.getFriendsIds(user.id)

//             emitToUsers(friendIds, "user_status_changed", {
//                 userId: user.id,
//                 status: "online",
//                 lastSeen: new Date(),
//             })
//         } catch (error) {
//             logger.error(error, "Error in Connection Handler")
//         }
//     },
// )

// export const handleDisconnection = buildHandler(async (user) => {
//     logger.info(user, "User disconnected:")

//     try {
//         await userService.updateStatus(user.id, "offline")

//         const friendIds = await friendService.getFriendsIds(user.id)

//         emitToUsers(friendIds, "user_status_changed", {
//             userId: user.id,
//             status: "offline",
//             lastSeen: new Date(),
//         })
//     } catch (err) {
//         logger.error(err, "Error in Disconnection Handler:")
//     }
// })
