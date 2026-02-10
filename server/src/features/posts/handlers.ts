import { getPaginatedData } from "@/utils/get-paginated-data"
import {
    makeBodyEndpoint,
    makeParamsEndpoint,
    makeIdBodyEndpoint,
    makeQueryEndpoint,
    makeIdQueryEndpoint,
} from "@/utils/wrappers"
import db from "@bchat/database"
import { comments, posts } from "@bchat/database/tables"
import {
    InsertCommentSchema,
    InsertPostSchema,
    PaginationSchema,
    PostsQuerySchema,
    UpdatePostSchema,
} from "@bchat/shared/validation"
import { and, count, desc, eq, ilike } from "drizzle-orm"
import { hasPermission } from "@bchat/shared/permissions"

export const getPosts = makeQueryEndpoint(
    PostsQuerySchema,
    async (req, res, next) => {
        const { page, perPage, search } = req.validatedQuery

        const offset = (page - 1) * perPage
        const limit = perPage

        try {
            const data = await db.query.posts.findMany({
                where: (posts, { ilike }) => {
                    if (search) return ilike(posts.content, `%${search}%`)
                },
                orderBy: desc(posts.createdAt),
                offset,
                limit,
                with: {
                    author: {
                        columns: {
                            id: true,
                            avatar: true,
                            name: true,
                            role: true,
                        },
                    },
                },
            })

            const [{ total }] = await db
                .select({ total: count() })
                .from(posts)
                .where(() => {
                    if (search) return ilike(posts.content, search)
                })

            res.status(200).json(
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

export const getPost = makeParamsEndpoint(["id"], async (req, res, next) => {
    const id = req.params.id

    try {
        const post = await db.query.posts.findFirst({
            where: (posts, { eq }) => eq(posts.id, id),
        })
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            })
        }

        res.status(200).json(post)
    } catch (err) {
        next(err)
    }
})

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
                .set({ content, isEdited: true })
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

    const condition = hasPermission(user.role, "post:delete:any")
        ? eq(posts.id, id)
        : and(eq(posts.id, id), eq(posts.authorId, user.id))

    try {
        const result = await db.delete(posts).where(condition)

        if (result.rowCount === 0) {
            return res.status(403).json({
                message: "Action not allowed",
            })
        }

        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

export const getPostComments = makeIdQueryEndpoint(
    PaginationSchema,
    async (req, res, next) => {
        const { page, perPage } = req.validatedQuery
        const postId = req.params.id

        const offset = (page - 1) * perPage
        const limit = perPage

        try {
            const data = await db.query.comments.findMany({
                where: (comments, { eq }) => eq(comments.postId, postId),
                orderBy: desc(comments.createdAt),
                offset,
                limit,
                with: {
                    author: {
                        columns: {
                            id: true,
                            avatar: true,
                            name: true,
                            role: true,
                        },
                    },
                },
            })

            const [{ total }] = await db
                .select({ total: count() })
                .from(comments)
                .where(() => eq(comments.postId, postId))

            res.status(200).json(
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
