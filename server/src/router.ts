import { authRouter } from "@/features/auth/router"
import { channelsRouter } from "@/features/channels/router"
import { commentsRouter } from "@/features/comments/router"
import { friendshipsRouter } from "@/features/friendships/router"
import { membersRouter } from "@/features/members/router"
import { messagesRouter } from "@/features/messages/router"
import { postsRouter } from "@/features/posts/router"
import { profileRouter } from "@/features/profile/router"
import { usersRouter } from "@/features/users/router"
import logger from "@/lib/logger"
import { requireAuth } from "@/middlewares/require-auth"
import db from "@bchat/database"
import { channels, users } from "@bchat/database/tables"
import bcrypt from "bcryptjs"
import { Router } from "express"

export const router = Router()

router.use("/auth", authRouter)
router.use("/friendships", requireAuth(), friendshipsRouter)
router.use("/posts", requireAuth(), postsRouter)
router.use("/comments", requireAuth(), commentsRouter)
router.use("/profile", requireAuth(), profileRouter)
router.use("/users", requireAuth(), usersRouter)
router.use("/channels", requireAuth(), channelsRouter)
router.use("/messages", requireAuth(), messagesRouter)
router.use("/members", requireAuth(), membersRouter)

//

if (process.env.NODE_ENV === "test") {
    router.post("/test/seed", async (req, res, next) => {
        try {
            await db.delete(users)
            await db.delete(channels)
            await db.insert(users).values([
                {
                    name: "reda",
                    email: "reda@example.com",
                    hashedPassword: await bcrypt.hash("password", 12),
                    role: "admin",
                },
                {
                    name: "ahmed",
                    email: "ahmed@example.com",
                    hashedPassword: await bcrypt.hash("password", 12),
                },
                {
                    name: "omar",
                    email: "omar@example.com",
                    hashedPassword: await bcrypt.hash("password", 12),
                },
            ])

            res.sendStatus(204)
            logger.info("db reset")
        } catch (err) {
            next(err)
        }
    })
}
