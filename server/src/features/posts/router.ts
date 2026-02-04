import { Router } from "express"
import {
    addComment,
    addPost,
    deletePost,
    updatePost,
} from "./handlers"

const router = Router()

// router.get("/")
// router.get("/:id")
router.post("/", addPost)
router.patch("/:id", updatePost)
router.delete("/:id", deletePost)
// comments
// router.get("/:id/comments")
router.post("/:id/comments", addComment)

export const postsRouter = router
