import { db } from "@/test/mocks/db"
import { createUser } from "@/test/mocks/factories"
import type { LoginCredentials, RegisterCredentials } from "@bchat/types"
import { http, HttpResponse } from "msw"

export const authHandlers = [
    http.get("/api/auth/me", () => {
        return HttpResponse.json(db.users[0])
    }),
    http.post<Record<string, string>, RegisterCredentials>(
        "/api/auth/register",
        async ({ request }) => {
            const data = await request.clone().json()

            const user = createUser(data)
            db.addUser(user)

            return HttpResponse.json(user, { status: 201 })
        },
    ),
    http.post<Record<string, string>, LoginCredentials>(
        "/api/auth/login",
        async ({ request }) => {
            const data = await request.clone().json()

            const user = createUser(data)
            db.addUser(user)

            return HttpResponse.json(user)
        },
    ),
]
