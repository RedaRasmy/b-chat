import { makeParamsEndpoint, makeSimpleEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { friendships } from "@bchat/database/tables"
import { and, eq, isNull, or } from "drizzle-orm"

export const getPending = makeSimpleEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const data = await db.query.friendships.findMany({
            where: (fr, { eq, and }) =>
                and(eq(fr.status, "pending"), eq(fr.receiverId, user.id)),
            with: {
                requester: {
                    columns: {
                        name: true,
                        avatar: true,
                        role: true,
                    },
                },
            },
        })
        res.json(data)
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
            with: {
                receiver: {
                    columns: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                    },
                },
                requester: {
                    columns: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                    },
                },
            },
        })

        const friends = data.map((rec) => {
            const friend =
                user.id === rec.requesterId ? rec.receiver : rec.requester
            return {
                id: rec.id,
                createdAt: rec.createdAt,
                friend,
            }
        })
        res.json(friends)
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
        res.json(data)
    } catch (err) {
        next(err)
    }
})

export const request = makeParamsEndpoint(
    ["userId"],
    async (req, res, next) => {
        const user = req.user!
        const targetId = req.params.userId

        try {
            const [friendship] = await db
                .insert(friendships)
                .values({
                    requesterId: user.id,
                    receiverId: targetId,
                })
                .returning()

            res.status(201).json(friendship)
        } catch (err) {
            next(err)
        }
    },
)

export const accept = makeParamsEndpoint(["id"], async (req, res, next) => {
    const user = req.user!
    const id = req.params.id

    try {
        const friendship = await db.query.friendships.findFirst({
            where: (fr, { eq, and }) =>
                and(eq(fr.id, id), eq(fr.receiverId, user.id)),
        })

        if (!friendship) {
            return res.status(404).json({
                message: "Friendship not found",
            })
        }
        if (friendship.status !== "pending") {
            return res.status(403).json({
                message: "You can't accept while the friendship is not pending",
            })
        }
        const [newFriendship] = await db
            .update(friendships)
            .set({
                status: "friend",
                acceptedAt: new Date(Date.now()),
            })
            .returning()

        res.json(newFriendship)
    } catch (err) {
        next(err)
    }
})

export const block = makeParamsEndpoint(["id"], async (req, res, next) => {
    const user = req.user!
    const id = req.params.id

    try {
        const friendship = await db.query.friendships.findFirst({
            where: (fr, { eq, and, or }) =>
                and(
                    eq(fr.id, id),
                    or(eq(fr.receiverId, user.id), eq(fr.requesterId, user.id)),
                ),
        })

        if (!friendship) {
            return res.status(404).json({
                message: "Friendship not found",
            })
        }
        if (friendship.status === "blocked") {
            return res.status(403).json({
                message:
                    "You can't block while the friendship is already blocked",
            })
        }
        const [newFriendship] = await db
            .update(friendships)
            .set({
                status: "blocked",
                blockedBy: user.id,
                blockedAt: new Date(Date.now()),
            })
            .returning()

        res.json(newFriendship)
    } catch (err) {
        next(err)
    }
})

export const remove = makeParamsEndpoint(["id"], async (req, res, next) => {
    const user = req.user!
    const id = req.params.id

    try {
        const result = await db.delete(friendships).where(
            and(
                eq(friendships.id, id), // id matching
                or(
                    // user must be in the friendship
                    eq(friendships.receiverId, user.id),
                    eq(friendships.requesterId, user.id),
                ),
                or(
                    // user must not be the blocked one
                    isNull(friendships.blockedBy),
                    eq(friendships.blockedBy, user.id),
                ),
            ),
        )
        if (result.rowCount === 0) {
            return res.status(403).json({
                message: "Unable to perform this action",
            })
        }

        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})
