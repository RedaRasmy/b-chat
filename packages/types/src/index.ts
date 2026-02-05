
export * from "./global"
export type LoginCredentials = {
    email: string
    password: string
}

export type RegisterCredentials = {
    name: string
    email: string
    password: string
}

export type { User, Post, Friendship, Comment } from "@bchat/database/tables"

export * from "./friendships"
export * from './users'