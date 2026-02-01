import { authRouter } from "@/features/auth/router"
import { Router } from "express"

export const router = Router()

router.use("/auth", authRouter)
