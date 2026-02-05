import { Comment } from "@bchat/database/tables"
import { OtherUser } from "./users"
import { Prettify } from "./global"

export type Author = Omit<OtherUser, "id">

export type CommentWithAuthor = Prettify<
    Comment & {
        author: Author
    }
>
