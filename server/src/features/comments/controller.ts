import { commentService } from "@/features/comments/service"
import { makeEndpoint } from "@/utils/make-endpoint"
import { IdParam, UpdateCommentSchema } from "@bchat/shared/validation"

export const updateComment = makeEndpoint(
    {
        body: UpdateCommentSchema,
        params: IdParam,
        user: true,
    },
    async (req, res, next) => {
        try {
            const comment = await commentService.updateComment({
                userId: req.user.id,
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
        params: IdParam,
        user: true,
    },
    async (req, res, next) => {
        try {
            await commentService.deleteComment(req.user, req.params.id)
            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
