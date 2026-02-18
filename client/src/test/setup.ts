import "@testing-library/jest-dom"
import { afterEach, beforeAll, afterAll } from "vitest"
import { cleanup } from "@testing-library/react"
import { server } from "./mocks/server"
import { db } from "@/test/mocks/db"

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))

afterEach(() => {
    server.resetHandlers()
    db.reset()
    cleanup()
})

afterAll(() => server.close())
