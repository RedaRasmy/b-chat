import { Router } from "express"
import {
    deleteProfile,
    getMyPosts,
    getProfile,
    updateProfile,
} from "./controller"

const router = Router()

router.get("/", getProfile)
router.get("/posts", getMyPosts)
router.patch("/", updateProfile)
router.delete("/", deleteProfile)

export const profileRouter = router
