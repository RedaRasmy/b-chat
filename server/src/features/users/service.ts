import { NotFoundError } from "@/errors"
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

    async getUserName(userId: string) {
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            columns: {
                name: true,
            },
        })
        if (!user) {
            throw new NotFoundError("User not found")
        }
        return user.name
    }
}

export const userService = new UserService()
