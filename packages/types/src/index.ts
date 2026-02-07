export * from "./global"
export * from "./friendships"
export * from "./users"
export * from "./posts"

export type LoginCredentials = {
    email: string
    password: string
}

export type RegisterCredentials = {
    name: string
    email: string
    password: string
}

export type {
    User,
    Post,
    Friendship,
    Comment,
    ChatMessage,
} from "@bchat/database/tables"
