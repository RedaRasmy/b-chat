export * from "./global"
export * from "./auth"
export * from "./friendships"
export * from "./users"
export * from "./posts"
export * from "./dms"
export * from "./messages"

export type {
    User,
    Post,
    Friendship,
    Comment,
    ChatMessage,
    Channel,
    DM,
} from "@bchat/database/tables"
