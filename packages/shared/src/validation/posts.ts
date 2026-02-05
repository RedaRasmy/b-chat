import { posts } from "@bchat/database/tables"
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod"
import { PaginationSchema, SearchSchema } from "./query"
import z from "zod"

export const InsertPostSchema = createInsertSchema(posts).pick({
    content: true,
})

export const SelectPostSchema = createSelectSchema(posts)

export const UpdatePostSchema = createUpdateSchema(posts)
    .pick({
        content: true,
    })
    .required()

export type PostFormData = {
    conent: string
}

// Query

export const PostsQuerySchema = PaginationSchema.extend({
    search: SearchSchema,
})

export type PostsQuery = z.infer<typeof PostsQuerySchema>

export type PostCommentsQuery = z.infer<typeof PaginationSchema>
