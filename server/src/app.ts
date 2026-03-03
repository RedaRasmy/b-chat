import { errorHandler } from "@/middlewares/error-handler"
import { notFound } from "@/middlewares/not-found"
import { router } from "@/router"
import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
import { allowedOrigins } from "@/config/allowed-origins"
import path from "path"
const __dirname = import.meta.dirname

export function createApp() {
    const app = express()

    app.use(cookieParser())
    app.use(express.json())
    app.use(
        cors({
            origin: allowedOrigins,
            credentials: true,
        }),
    )

    app.get("/health", (req, res) => res.send("ok"))
    app.use("/api", router)

    app.use(express.static(path.join(__dirname, "../../client/dist")))
    app.get("*path", (req, res) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
    })

    app.use(notFound)
    app.use(errorHandler)

    return app
}
