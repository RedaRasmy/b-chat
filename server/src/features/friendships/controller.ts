import { friendService } from "@/features/friendships/service"
import { userService } from "@/features/users/service"
import { emitToUser } from "@/socket"
import { makeEndpoint } from "@/utils/make-endpoint"
import z from "zod"

export const getReceivedRequests = makeEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const data = await friendService.getReceivedRequests(user.id)
        res.json(data)
    } catch (err) {
        next(err)
    }
})

export const getSentRequests = makeEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const data = await friendService.getSentRequests(user.id)
        res.json(data)
    } catch (err) {
        next(err)
    }
})

export const getFriends = makeEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const friends = await friendService.getFriends(user.id)
        res.json(friends)
    } catch (err) {
        next(err)
    }
})

export const getBlocked = makeEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const blocked = await friendService.getBlocked(user.id)
        res.json(blocked)
    } catch (err) {
        next(err)
    }
})

export const request = makeEndpoint(
    {
        params: z.object({
            userId: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const userId = req.user!.id
        const targetId = req.params.userId

        try {
            const userName = await userService.getUserName(userId)
            const friendship = await friendService.request(userId, targetId)

            emitToUser(targetId, "friend_request", {
                userName,
            })

            res.status(201).json(friendship)
        } catch (err) {
            next(err)
        }
    },
)

export const accept = makeEndpoint(
    {
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const userId = req.user!.id
        const friendshipId = req.params.id

        try {
            const { friendship, userName } = await friendService.accept(
                userId,
                friendshipId,
            )

            emitToUser(friendship.requesterId, "request_accepted", {
                userName,
            })

            res.json(friendship)
        } catch (err) {
            next(err)
        }
    },
)

export const block = makeEndpoint(
    {
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const user = req.user!
        const friendshipId = req.params.id

        try {
            const friendship = await friendService.block(user.id, friendshipId)

            res.json(friendship)
        } catch (err) {
            next(err)
        }
    },
)

export const remove = makeEndpoint(
    {
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const user = req.user!
        const id = req.params.id

        try {
            await friendService.remove(user.id, id)
            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
