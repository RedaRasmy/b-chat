export * from "./global"
export * from "./auth"
export * from "./friendships"
export * from "./users"
export * from "./posts"
export * from "./channels"
export * from "./messages"

export type {
    User,
    Post,
    Friendship,
    Comment,
    Message,
    Channel,
    DM,
    Group,
} from "@bchat/database/tables"
