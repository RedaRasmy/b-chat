import { AccessTokenPayload } from "@/lib/jwt"
import db from "@bchat/database"
import { comments } from "@bchat/database/tables"
import { hasPermission } from "@bchat/shared/permissions"
import { and, eq } from "drizzle-orm"

export const commentService = {
    async updateComment({
        userId,
        commentId,
        content,
    }: {
        userId: string
        commentId: string
        content: string
    }) {
        const [newComment] = await db
            .update(comments)
            .set({
                content,
                isEdited: true,
            })
            .where(
                and(eq(comments.authorId, userId), eq(comments.id, commentId)),
            )
            .returning()

        if (!newComment) {
            throw new Error("Failed to update comment")
        }

        return newComment
    },

    async deleteComment(user: AccessTokenPayload, commentId: string) {
        const condition = hasPermission(user.role, "comment:delete:any")
            ? eq(comments.id, commentId)
            : and(eq(comments.id, commentId), eq(comments.authorId, user.id))

        const result = await db.delete(comments).where(condition)

        if (result.rowCount === 0) {
            throw new Error("Failed to delete comment")
        }
    },
}
