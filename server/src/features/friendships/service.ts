import { BadRequestError, ForbiddenError, NotFoundError } from "@/errors"
import db from "@bchat/database"
import { friendships } from "@bchat/database/tables"
import { Friend } from "@bchat/types"
import { and, eq, isNull, or } from "drizzle-orm"

export const friendService = {
    async getFriendsIds(userId: string) {
        const userFriendships = await db.query.friendships.findMany({
            where: (fr, { eq, or }) =>
                or(eq(fr.receiverId, userId), eq(fr.requesterId, userId)),
            columns: {
                receiverId: true,
                requesterId: true,
            },
        })
        return userFriendships.map((fr) =>
            fr.requesterId === userId ? fr.receiverId : fr.requesterId,
        )
    },

    async request(userId: string, targetId: string) {
        const [friendship] = await db
            .insert(friendships)
            .values({
                requesterId: userId,
                receiverId: targetId,
            })
            .returning()

        return friendship
    },

    async accept(userId: string, friendshipId: string) {
        const friendship = await db.query.friendships.findFirst({
            where: (fr, { eq, and }) =>
                and(eq(fr.id, friendshipId), eq(fr.receiverId, userId)),
            with: {
                receiver: {
                    columns: {
                        name: true,
                    },
                },
            },
        })

        if (!friendship) {
            throw new NotFoundError("Friendship not fount")
        }
        if (friendship.status !== "pending") {
            throw new BadRequestError(
                "You can't accept while the friendship is not pending",
            )
        }
        const [newFriendship] = await db
            .update(friendships)
            .set({
                status: "friend",
                acceptedAt: new Date(Date.now()),
            })
            .where(
                and(
                    eq(friendships.id, friendshipId),
                    eq(friendships.receiverId, userId),
                ),
            )
            .returning()

        return {
            userName: friendship.receiver.name,
            friendship: newFriendship,
        }
    },

    async getBlocked(userId: string) {
        return await db.query.friendships.findMany({
            where: (fr, { eq, and, or }) =>
                and(
                    eq(fr.status, "blocked"),
                    or(eq(fr.receiverId, userId), eq(fr.requesterId, userId)),
                    eq(fr.blockedBy, userId),
                ),
        })
    },

    async getFriends(userId: string) {
        const data = await db.query.friendships.findMany({
            where: (fr, { eq, and, or }) =>
                and(
                    eq(fr.status, "friend"),
                    or(eq(fr.receiverId, userId), eq(fr.requesterId, userId)),
                ),
            with: {
                receiver: {
                    columns: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                        status: true,
                        lastSeen: true,
                    },
                },
                requester: {
                    columns: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                        status: true,
                        lastSeen: true,
                    },
                },
            },
        })
        const friends: Friend[] = data.map((rec) => {
            const friend =
                userId === rec.requesterId ? rec.receiver : rec.requester
            return {
                ...friend,
                acceptedAt: rec.acceptedAt,
                createdAt: rec.createdAt,
                friendshipId: rec.id,
            }
        })
        return friends
    },

    async block(userId: string, friendshipId: string) {
        const friendship = await db.query.friendships.findFirst({
            where: (fr, { eq, and, or }) =>
                and(
                    eq(fr.id, friendshipId),
                    or(eq(fr.receiverId, userId), eq(fr.requesterId, userId)),
                ),
        })

        if (!friendship) {
            throw new NotFoundError("Friendship not found")
        }

        if (friendship.status === "blocked") {
            throw new BadRequestError("Friendship is already blocked")
        }
        const [newFriendship] = await db
            .update(friendships)
            .set({
                status: "blocked",
                blockedBy: userId,
                blockedAt: new Date(Date.now()),
            })
            .where(
                and(
                    eq(friendships.id, friendshipId),
                    or(
                        eq(friendships.receiverId, userId),
                        eq(friendships.requesterId, userId),
                    ),
                ),
            )
            .returning()

        return newFriendship
    },

    async remove(userId: string, friendshipId: string) {
        const result = await db.delete(friendships).where(
            and(
                eq(friendships.id, friendshipId),
                or(
                    // user must be in the friendship
                    eq(friendships.receiverId, userId),
                    eq(friendships.requesterId, userId),
                ),
                or(
                    // user must not be the blocked one
                    isNull(friendships.blockedBy),
                    eq(friendships.blockedBy, userId),
                ),
            ),
        )
        if (result.rowCount === 0) {
            throw new ForbiddenError("Action not allowed")
        }
    },

    async getSentRequests(userId: string) {
        return await db.query.friendships.findMany({
            where: (fr, { eq, and }) =>
                and(eq(fr.status, "pending"), eq(fr.requesterId, userId)),
            with: {
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
    },

    async getReceivedRequests(userId: string) {
        return await db.query.friendships.findMany({
            where: (fr, { eq, and }) =>
                and(eq(fr.status, "pending"), eq(fr.receiverId, userId)),
            with: {
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
    },
}
