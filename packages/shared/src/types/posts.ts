import type { Comment, Post } from "@bchat/database/tables"
import type { OtherUser } from "./users.js"
import type { Prettify } from "./global.js"

export type CommentWithAuthor = Prettify<
    Comment & {
        author: OtherUser
    }
>

export type PostWithAuthor = Prettify<
    Post & {
        author: OtherUser
    }
>
