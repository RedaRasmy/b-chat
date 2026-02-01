import { api } from "@/lib/api"
import type {
    LoginCredentials,
    RegisterCredentials,
    User,
} from "@bchat/shared/types"

export async function registerRequest(data: RegisterCredentials) {
    const res = await api.post("/auth/register", data)
    return res.data as User
}

export async function loginRequest(data: LoginCredentials) {
    const res = await api.post("/auth/login", data)
    return res.data as User
}

export async function logoutRequest() {
    return api.post("/auth/logout")
}

export async function refresh() {
    const res = await api.post("/auth/refresh")
    return res.data as User
}

export async function fetchMe() {
    const res = await api.get("/auth/me")
    return res.data as User
}