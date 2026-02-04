import { posts } from "@bchat/database/tables"
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod"
import z from "zod"
import { getSortSchema, PaginationSchema, SearchSchema } from "./query"

export const InsertPostSchema = createInsertSchema(posts).pick({
    content: true,
})

export const SelectPostSchema = createSelectSchema(posts)

export const UpdatePostSchema = createUpdateSchema(posts)
    .pick({
        content: true,
    })
    .required()

export type IPost = z.infer<typeof InsertPostSchema>
export type SPost = z.infer<typeof SelectPostSchema>
export type UPost = z.infer<typeof UpdatePostSchema>

// Query

export const PostsQuerySchema = PaginationSchema.extend({
    search: SearchSchema,
})
