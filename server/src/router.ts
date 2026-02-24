import { authRouter } from "@/features/auth/router"
import { channelsRouter } from "@/features/channels/router"
import { commentsRouter } from "@/features/comments/router"
import { friendshipsRouter } from "@/features/friendships/router"
import { membersRouter } from "@/features/members/router"
import { messagesRouter } from "@/features/messages/router"
import { postsRouter } from "@/features/posts/router"
import { profileRouter } from "@/features/profile/router"
import { usersRouter } from "@/features/users/router"
import { requireAuth } from "@/middlewares/require-auth"
import { testRouter } from "@/test"
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

// Conditional routes

if (process.env.NODE_ENV === "test") {
    router.use("/test", testRouter)
}
