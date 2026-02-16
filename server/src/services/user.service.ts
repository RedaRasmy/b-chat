import db from "@bchat/database"
import { users } from "@bchat/database/tables"
import { eq } from "drizzle-orm"
import { getFriendsIds } from "@/queries/get-friends"

export class UserService {
    async updateStatus(userId: string, status: "online" | "offline") {
        return await db
            .update(users)
            .set({
                status,
                ...(status === "offline" && { lastSeen: new Date() }),
            })
            .where(eq(users.id, userId))
    }

    async getFriends(userId: string) {
        return await getFriendsIds(userId)
    }
}

export const userService = new UserService()
