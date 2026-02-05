import { comments } from "@bchat/database/tables"
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod"

export const InsertCommentSchema = createInsertSchema(comments).pick({
    content: true,
})

export const SelectCommentSchema = createSelectSchema(comments)

export const UpdateCommentSchema = createUpdateSchema(comments)
    .pick({
        content: true,
    })
    .required()

export type CommentFormData = {
    content: string
}
