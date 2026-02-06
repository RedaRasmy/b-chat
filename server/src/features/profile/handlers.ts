import { makeBodyEndpoint, makeSimpleEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { users } from "@bchat/database/tables"
import { UpdateProfileSchema } from "@bchat/shared/validation"
import { eq } from "drizzle-orm"

export const getProfile = makeSimpleEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const profile = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, user.id),
            columns: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                role: true,
            },
        })
        if (!profile) {
            return res.status(404).json({
                message: "Profile not found",
            })
        }

        res.json(profile)
    } catch (err) {
        next(err)
    }
})

export const getMyPosts = makeSimpleEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const posts = await db.query.posts.findMany({
            where: (posts, { eq }) => eq(posts.authorId, user.id),
        })

        res.json(posts)
    } catch (err) {
        next(err)
    }
})

export const updateProfile = makeBodyEndpoint(
    UpdateProfileSchema,
    async (req, res, next) => {
        const user = req.user!
        const { name } = req.body

        try {
            const [newProfile] = await db
                .update(users)
                .set({
                    name,
                })
                .where(eq(users.id, user.id))
                .returning()

            res.json(newProfile)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteProfile = makeSimpleEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const result = await db.delete(users).where(eq(users.id, user.id))

        if (result.rowCount === 0) {
            return res.status(403).json({
                message: "Action not allowed",
            })
        }
        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})
