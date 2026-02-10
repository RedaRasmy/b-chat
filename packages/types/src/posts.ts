import { Comment, Post } from "@bchat/database/tables"
import { OtherUser } from "./users"
import { Prettify } from "./global"

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
