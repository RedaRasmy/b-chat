import { Router } from "express"
import {
    addComment,
    addPost,
    deletePost,
    getPost,
    getPostComments,
    getPosts,
    updatePost,
} from "./handlers"

const router = Router()

router.get("/", getPosts)
router.get("/:id", getPost)
router.post("/", addPost)
router.patch("/:id", updatePost)
router.delete("/:id", deletePost)
// comments
router.get("/:id/comments", getPostComments)
router.post("/:id/comments", addComment)

export const postsRouter = router
