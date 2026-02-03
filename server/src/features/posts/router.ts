import { Router } from "express"

const router = Router()

router.get("/")
router.get("/:id")
router.post("/")
router.patch("/:id")
router.delete("/:id")
// comments
router.get("/:id/comments")
router.post("/:id/comments")

export const postsRouter = router
