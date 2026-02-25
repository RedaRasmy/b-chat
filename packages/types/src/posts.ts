import type { Comment, Post } from "@bchat/database/tables"
import type { OtherUser } from "./users"
import type { Prettify } from "./global"

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
