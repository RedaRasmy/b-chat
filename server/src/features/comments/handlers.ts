import { makeByIdEndpoint, makeIdBodyEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { comments } from "@bchat/database/tables"
import { hasPermission } from "@bchat/shared/permissions"
import { UpdateCommentSchema } from "@bchat/shared/validation"
import { and, eq } from "drizzle-orm"

export const updateComment = makeIdBodyEndpoint(
    UpdateCommentSchema,
    async (req, res, next) => {
        const user = req.user!
        const id = req.params.id
        const { content } = req.body

        const conditions = () => {
            return and(eq(comments.authorId, user.id), eq(comments.id, id))
        }

        try {
            const [newComment] = await db
                .update(comments)
                .set({
                    content,
                    isEdited: true,
                })
                .where(conditions())
                .returning()

            res.status(200).json(newComment)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteComment = makeByIdEndpoint(async (req, res, next) => {
    const user = req.user!
    const id = req.params.id

    const condition = hasPermission(user.role, "comment:delete:any")
        ? eq(comments.id, id)
        : and(eq(comments.id, id), eq(comments.authorId, user.id))

    try {
        const result = await db.delete(comments).where(condition)
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
