import { NotFoundError } from "@/errors"
import { AccessTokenPayload } from "@/lib/jwt"
import db from "@bchat/database"
import { comments, posts } from "@bchat/database/tables"
import { hasPermission } from "@bchat/shared/permissions"
import { and, desc, eq } from "drizzle-orm"

export const postService = {
    async getPosts({
        search,
        offset,
        limit,
    }: {
        search?: string
        offset: number
        limit: number
    }) {
        return await db.query.posts.findMany({
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
    },

    async getPost(postId: string) {
        const post = await db.query.posts.findFirst({
            where: (posts, { eq }) => eq(posts.id, postId),
        })
        if (!post) {
            throw new NotFoundError("Post not found")
        }

        return post
    },

    async createPost(userId: string, content: string) {
        const [post] = await db
            .insert(posts)
            .values({
                authorId: userId,
                content,
            })
            .returning()

        return post
    },

    async updatePost({
        userId,
        postId,
        content,
    }: {
        userId: string
        postId: string
        content: string
    }) {
        const [newPost] = await db
            .update(posts)
            .set({ content, isEdited: true })
            .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
            .returning()

        if (!newPost) {
            throw new NotFoundError("Post not found")
        }

        return newPost
    },

    async deletePost({
        user,
        postId,
    }: {
        user: AccessTokenPayload
        postId: string
    }) {
        const condition = hasPermission(user.role, "post:delete:any")
            ? eq(posts.id, postId)
            : and(eq(posts.id, postId), eq(posts.authorId, user.id))

        const result = await db.delete(posts).where(condition)

        if (result.rowCount === 0) {
            throw new Error("Failed to delete post")
        }
    },

    async getPostComments({
        postId,
        offset,
        limit,
    }: {
        postId: string
        offset: number
        limit: number
    }) {
        return await db.query.comments.findMany({
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
    },

    async createComment({
        userId,
        postId,
        content,
    }: {
        userId: string
        postId: string
        content: string
    }) {
        const [comment] = await db
            .insert(comments)
            .values({
                authorId: userId,
                postId: postId,
                content,
            })
            .returning()

        return comment
    },

    async getUserPosts(userId: string) {
        return await db.query.posts.findMany({
            where: (posts, { eq }) => eq(posts.authorId, userId),
            orderBy: desc(posts.createdAt),
        })
    },
}
