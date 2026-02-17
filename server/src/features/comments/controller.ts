import { commentService } from "@/features/comments/service"
import { makeEndpoint } from "@/utils/make-endpoint"
import { UpdateCommentSchema } from "@bchat/shared/validation"
import z from "zod"

export const updateComment = makeEndpoint(
    {
        body: UpdateCommentSchema,
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        try {
            const comment = await commentService.updateComment({
                userId: req.user!.id,
                commentId: req.params.id,
                content: req.body.content,
            })
            res.json(comment)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteComment = makeEndpoint(
    {
        params: z.object({
            id: z.uuid(),
        }),
    },
    async (req, res, next) => {
        try {
            await commentService.deleteComment(req.user!, req.params.id)
            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
