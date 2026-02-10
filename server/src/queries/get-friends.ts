import db from "@bchat/database"

export async function getFriendsIds(userId: string) {
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
}
