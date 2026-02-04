import { Router } from "express"
import { deleteProfile, getProfile, updateProfile } from "./handlers"

const router = Router()

router.get("/", getProfile)
router.patch("/", updateProfile)
router.delete("/", deleteProfile)

export const profileRouter = router
