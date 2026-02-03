import { authRouter } from "@/features/auth/router"
import { commentsRouter } from "@/features/comments/router"
import { friendshipsRouter } from "@/features/friendships/router"
import { postsRouter } from "@/features/posts/router"
import { requireAuth } from "@/middlewares/require-auth"
import { Router } from "express"

export const router = Router()

router.use("/auth", authRouter)
router.use("/friendships", requireAuth(), friendshipsRouter)
router.use("/posts", requireAuth(), postsRouter)
router.use("/comments", requireAuth(), commentsRouter)
