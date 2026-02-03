import { authRouter } from "@/features/auth/router"
import { friendshipsRouter } from "@/features/friendships/router"
import { requireAuth } from "@/middlewares/require-auth"
import { Router } from "express"

export const router = Router()

router.use("/auth", authRouter)
router.use("/friendships", requireAuth(), friendshipsRouter)
