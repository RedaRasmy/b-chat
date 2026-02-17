import db from "@bchat/database"
import { users } from "@bchat/database/tables"
import { eq } from "drizzle-orm"

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

    async getUsers({ userId, search }: { userId: string; search?: string }) {
        return await db.query.users.findMany({
            where: (users, { ilike, and, ne }) => {
                if (search)
                    return and(
                        ne(users.id, userId),
                        ilike(users.name, `%${search}%`),
                    )

                return ne(users.id, userId)
            },
            columns: {
                id: true,
                name: true,
                avatar: true,
                role: true,
            },
            limit: 20,
        })
    }
}

export const userService = new UserService()
