import { comments } from "@bchat/database/tables"
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod"
import z from "zod"

export const InsertCommentSchema = createInsertSchema(comments).pick({
    content: true,
})

export const SelectCommentSchema = createSelectSchema(comments)

export const UpdateCommentSchema = createUpdateSchema(comments)
    .pick({
        content: true,
    })
    .required()

export type IComment = z.infer<typeof InsertCommentSchema>
export type SComment = z.infer<typeof SelectCommentSchema>
export type UComment = z.infer<typeof UpdateCommentSchema>
