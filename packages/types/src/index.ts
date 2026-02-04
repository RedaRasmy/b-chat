export type User = {
    id: string
    name: string
    role: "admin" | "user"
    email: string
    avatar: string | null
}

export type LoginCredentials = {
    email: string
    password: string
}

export type RegisterCredentials = {
    name: string
    email: string
    password: string
}
