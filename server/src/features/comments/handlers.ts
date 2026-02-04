import { makeByIdEndpoint, makeIdBodyEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { comments } from "@bchat/database/tables"
import { UpdateCommentSchema } from "@bchat/validation"
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

    const conditions = () => {
        return and(eq(comments.authorId, user.id), eq(comments.id, id))
    }

    try {
        const result = await db.delete(comments).where(conditions())
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
