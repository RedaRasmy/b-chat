import {
    makeBodyEndpoint,
    makeParamsEndpoint,
    makeIdBodyEndpoint,
} from "@/utils/wrappers"
import db from "@bchat/database"
import { comments, posts } from "@bchat/database/tables"
import {
    InsertCommentSchema,
    InsertPostSchema,
    UpdatePostSchema,
} from "@bchat/validation"
import { and, eq } from "drizzle-orm"


export const addPost = makeBodyEndpoint(
    InsertPostSchema,
    async (req, res, next) => {
        const { content } = req.body
        const user = req.user!

        try {
            const [post] = await db
                .insert(posts)
                .values({
                    authorId: user.id,
                    content,
                })
                .returning()

            res.status(201).json(post)
        } catch (err) {
            next(err)
        }
    },
)

export const updatePost = makeIdBodyEndpoint(
    UpdatePostSchema,
    async (req, res, next) => {
        const { content } = req.body
        const user = req.user!
        const id = req.params.id as string

        try {
            const [newPost] = await db
                .update(posts)
                .set({ content })
                .where(and(eq(posts.id, id), eq(posts.authorId, user.id)))
                .returning()

            if (!newPost) {
                return res.status(404).json({
                    message: "Post not found",
                })
            }

            res.status(200).json(newPost)
        } catch (err) {
            next(err)
        }
    },
)

export const deletePost = makeParamsEndpoint(["id"], async (req, res, next) => {
    const id = req.params.id
    const user = req.user!

    try {
        const result = await db
            .delete(posts)
            .where(and(eq(posts.authorId, user.id), eq(posts.id, id)))

        if (result.rowCount === 0) {
            return res.status(403).json({
                message: "Unable to perform this action",
            })
        }

        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

// TODO: get post comments ...

export const addComment = makeIdBodyEndpoint(
    InsertCommentSchema,
    async (req, res, next) => {
        const id = req.params.id
        const { content } = req.body
        const user = req.user!

        try {
            const [comment] = await db
                .insert(comments)
                .values({
                    authorId: user.id,
                    postId: id,
                    content,
                })
                .returning()

            res.status(201).json(comment)
        } catch (err) {
            next(err)
        }
    },
)
