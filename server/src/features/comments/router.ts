import { Router } from "express"

const router = Router()

router.patch("/:id")
router.delete("/:id")

export const commentsRouter = router
