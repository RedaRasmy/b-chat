import {
    getReceivedRequests,
    getSentRequests,
    getBlocked,
    getFriends,
    accept,
    block,
    request,
    remove,
} from "@/features/friendships/handlers"
import { Router } from "express"

const router = Router()

router.get("/requests/received", getReceivedRequests)
router.get("/requests/sent", getSentRequests)
router.get("/friends", getFriends)
router.get("/blocked", getBlocked)

router.post("/:userId", request)
router.patch("/:id/accept", accept)
router.patch("/:id/block", block)
router.delete("/:id", remove) // reject or unfriend or unblock

export const friendshipsRouter = router
