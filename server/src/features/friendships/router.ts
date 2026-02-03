import { Router } from "express"

const router = Router()

router.get("/pending/received")
router.get("/pending/sent")
router.get("/friends")
router.get("/blocked")

router.post("/:userId")
router.patch("/:id/accept")
router.patch("/:id/block")
router.delete("/:id") // reject or unfriend or unblock

export const friendshipsRouter = router
