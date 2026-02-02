import { Router } from "express"
import { register, login, refresh, logout, fetchMe } from "./handlers"
import { requireAuth } from "@/middlewares/require-auth"
import { githubCallback, githubLogin } from "./oauth/github"
import { googleCallback, googleLogin } from "./oauth/google"

export const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh", refresh)
authRouter.post("/logout", logout)
authRouter.get("/me", requireAuth(), fetchMe)

// OAuth

authRouter.get("/github/login", githubLogin)
authRouter.get("/github/callback", githubCallback)

authRouter.get("/google/login", googleLogin)
authRouter.get("/google/callback", googleCallback)
