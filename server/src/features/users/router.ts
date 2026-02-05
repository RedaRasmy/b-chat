import { getUsers } from "@/features/users/handlers"
import { Router } from "express"

const router = Router()

router.get("/", getUsers)

export const usersRouter = router
