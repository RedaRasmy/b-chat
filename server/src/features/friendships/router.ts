import {
    getReceived,
    getSent,
    getBlocked,
    getFriends,
} from "@/features/friendships/handlers"
import { Router } from "express"

const router = Router()

router.get("/pending/received", getReceived)
router.get("/pending/sent", getSent)
router.get("/friends", getFriends)
router.get("/blocked", getBlocked)

router.post("/:userId")
router.patch("/:id/accept")
router.patch("/:id/block")
router.delete("/:id") // reject or unfriend or unblock

export const friendshipsRouter = router
