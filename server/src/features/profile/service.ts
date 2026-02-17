import { NotFoundError } from "@/errors"
import db from "@bchat/database"
import { users } from "@bchat/database/tables"
import { Profile } from "@bchat/types"
import { eq } from "drizzle-orm"

export const profileService = {
    async getProfile(userId: string) {
        const profile = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            columns: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                role: true,
            },
        })

        if (!profile) {
            throw new NotFoundError("Profile not found")
        }

        return profile
    },

    async updateProfile(userId: string, name: string) {
        const [data] = await db
            .update(users)
            .set({
                name,
            })
            .where(eq(users.id, userId))
            .returning()

        if (!data) {
            throw new Error("Failed to update profile")
        }

        const newProfile: Profile = {
            id: data.id,
            name: data.name,
            avatar: data.avatar,
            email: data.email,
            role: data.role,
        }

        return newProfile
    },

    async deleteProfile(userId: string) {
        const result = await db.delete(users).where(eq(users.id, userId))

        if (result.rowCount === 0) {
            throw new Error("Failed to deleted profile")
        }
    },
}
