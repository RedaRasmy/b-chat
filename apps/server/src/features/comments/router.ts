import { Router } from "express"
import { updateComment, deleteComment } from "@/features/comments/controller.js"

const router = Router()

router.patch("/:id", updateComment)
router.delete("/:id", deleteComment)

export const commentsRouter: Router = router
