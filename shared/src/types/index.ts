export type User = {
    name: string
    role: "admin" | "user"
    email: string
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
