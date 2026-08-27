import { http, HttpResponse } from "msw"
import { createUser } from "./factories"
import { server } from "./server"
import type { User } from "@bchat/types"

export const scenarios = {
    authSuccess: (userOverrides: Partial<User> = {}) => {
        server.use(
            http.get("/api/auth/me", () =>
                HttpResponse.json(createUser(userOverrides)),
            ),
        )
    },

    unauthorized: () => {
        server.use(
            http.get("/api/auth/me", () =>
                HttpResponse.json({ message: "Unauthorized" }, { status: 401 }),
            ),
        )
    },

    networkError: (path: string) => {
        server.use(http.get(path, () => HttpResponse.error()))
    },
}
