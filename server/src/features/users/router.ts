import { getUsers } from "@/features/users/controller"
import { Router } from "express"

const router = Router()

router.get("/", getUsers)

export const usersRouter = router
