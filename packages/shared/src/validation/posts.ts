import { posts } from "@bchat/database/tables"
import { createSelectSchema } from "drizzle-zod"
import { PaginationSchema, SearchSchema } from "./query"
import z from "zod"

export const InsertPostSchema = z.object({
    content: z
        .string()
        .min(1, "Post content is required")
        .max(500, "Post content must not exceed 500 characters"),
})

export const SelectPostSchema = createSelectSchema(posts)

export const UpdatePostSchema = InsertPostSchema

export type PostFormData = {
    content: string
}

// Query

export const PostsQuerySchema = PaginationSchema.extend({
    search: SearchSchema,
})

export type PostsQuery = z.infer<typeof PostsQuerySchema>

export type PostCommentsQuery = z.infer<typeof PaginationSchema>
