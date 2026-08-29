import { authRouter } from "@/features/auth/router.js"
import { channelsRouter } from "@/features/channels/router.js"
import { commentsRouter } from "@/features/comments/router.js"
import { friendshipsRouter } from "@/features/friendships/router.js"
import { membersRouter } from "@/features/members/router.js"
import { messagesRouter } from "@/features/messages/router.js"
import { postsRouter } from "@/features/posts/router.js"
import { profileRouter } from "@/features/profile/router.js"
import { usersRouter } from "@/features/users/router.js"
import { requireAuth } from "@/middlewares/require-auth.js"
import { testRouter } from "@/test.js"
import { Router } from "express"

export const router: Router = Router()

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
