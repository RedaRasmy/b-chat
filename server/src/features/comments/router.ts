import { Router } from "express"
import { updateComment, deleteComment } from "@/features/comments/controller"

const router = Router()

router.patch("/:id", updateComment)
router.delete("/:id", deleteComment)

export const commentsRouter = router
