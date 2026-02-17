import { getPaginatedData } from "@/utils/get-paginated-data"
import db from "@bchat/database"
import { comments, posts } from "@bchat/database/tables"
import {
    InsertCommentSchema,
    InsertPostSchema,
    PaginationSchema,
    PostsQuerySchema,
    UpdatePostSchema,
} from "@bchat/shared/validation"
import { count, eq, ilike } from "drizzle-orm"
import { postService } from "@/features/posts/service"
import { makeEndpoint } from "@/utils/make-endpoint"
import z from "zod"

export const getPosts = makeEndpoint(
    {
        query: PostsQuerySchema,
    },
    async (req, res, next) => {
        const { page, perPage, search } = req.query

        const offset = (page - 1) * perPage
        const limit = perPage

        try {
            const data = await postService.getPosts({ search, offset, limit })

            const [{ total }] = await db
                .select({ total: count() })
                .from(posts)
                .where(() => {
                    if (search) return ilike(posts.content, search)
                })

            res.json(
                getPaginatedData({
                    data,
                    total,
                    page,
                    perPage,
                }),
            )
        } catch (err) {
            next(err)
        }
    },
)

export const getPost = makeEndpoint(
    {
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        try {
            const post = await postService.getPost(req.params.id)

            res.json(post)
        } catch (err) {
            next(err)
        }
    },
)

export const addPost = makeEndpoint(
    {
        body: InsertPostSchema,
    },
    async (req, res, next) => {
        const { content } = req.body
        const user = req.user!

        try {
            const post = await postService.createPost(user.id, content)

            res.status(201).json(post)
        } catch (err) {
            next(err)
        }
    },
)

export const updatePost = makeEndpoint(
    {
        body: UpdatePostSchema,
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const { content } = req.body
        const userId = req.user!.id
        const postId = req.params.id

        try {
            const newPost = await postService.updatePost({
                userId,
                postId,
                content,
            })

            res.json(newPost)
        } catch (err) {
            next(err)
        }
    },
)

export const deletePost = makeEndpoint(
    {
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const postId = req.params.id
        const user = req.user!

        try {
            await postService.deletePost({ user, postId })

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const getPostComments = makeEndpoint(
    {
        query: PaginationSchema,
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const { page, perPage } = req.query
        const postId = req.params.id

        const offset = (page - 1) * perPage
        const limit = perPage

        try {
            const data = await postService.getPostComments({
                postId,
                offset,
                limit,
            })

            const [{ total }] = await db
                .select({ total: count() })
                .from(comments)
                .where(() => eq(comments.postId, postId))

            res.json(
                getPaginatedData({
                    data,
                    total,
                    page,
                    perPage,
                }),
            )
        } catch (err) {
            next(err)
        }
    },
)

export const addComment = makeEndpoint(
    {
        body: InsertCommentSchema,
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const postId = req.params.id
        const { content } = req.body
        const userId = req.user!.id

        try {
            const comment = await postService.createComment({
                userId,
                postId,
                content,
            })

            res.status(201).json(comment)
        } catch (err) {
            next(err)
        }
    },
)
