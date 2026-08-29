import { getUsers } from "@/features/users/controller.js"
import { Router } from "express"

const router = Router()

router.get("/", getUsers)

export const usersRouter: Router = router
