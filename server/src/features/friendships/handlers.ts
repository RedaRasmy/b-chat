import { makeSimpleEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"

export const getReceived = makeSimpleEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const data = await db.query.friendships.findMany({
            where: (fr, { eq, and }) =>
                and(eq(fr.status, "pending"), eq(fr.receiverId, user.id)),
        })
        res.send(200).json(data)
    } catch (err) {
        next(err)
    }
})

export const getSent = makeSimpleEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const data = await db.query.friendships.findMany({
            where: (fr, { eq, and }) =>
                and(eq(fr.status, "pending"), eq(fr.requesterId, user.id)),
        })
        res.send(200).json(data)
    } catch (err) {
        next(err)
    }
})

export const getFriends = makeSimpleEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const data = await db.query.friendships.findMany({
            where: (fr, { eq, and, or }) =>
                and(
                    eq(fr.status, "friend"),
                    or(eq(fr.receiverId, user.id), eq(fr.requesterId, user.id)),
                ),
        })
        res.send(200).json(data)
    } catch (err) {
        next(err)
    }
})

export const getBlocked = makeSimpleEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const data = await db.query.friendships.findMany({
            where: (fr, { eq, and, or }) =>
                and(
                    eq(fr.status, "blocked"),
                    or(eq(fr.receiverId, user.id), eq(fr.requesterId, user.id)),
                    eq(fr.blockedBy, user.id),
                ),
        })
        res.send(200).json(data)
    } catch (err) {
        next(err)
    }
})
