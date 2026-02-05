import { posts } from "@bchat/database/tables"
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod"
import { PaginationSchema, SearchSchema } from "./query"

export const InsertPostSchema = createInsertSchema(posts).pick({
    content: true,
})

export const SelectPostSchema = createSelectSchema(posts)

export const UpdatePostSchema = createUpdateSchema(posts)
    .pick({
        content: true,
    })
    .required()

// Query

export const PostsQuerySchema = PaginationSchema.extend({
    search: SearchSchema,
})
