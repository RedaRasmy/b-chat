import http from "http"
import express from "express"
import cors from "cors"
import { router } from "./router"
import cookieParser from "cookie-parser"
import { notFound } from "@/middlewares/not-found"
import { errorHandler } from "@/middlewares/error-handler"
import { Server } from "socket.io"
import { parseCookie } from "cookie"
import { verifyAccessToken } from "@/lib/jwt"

const app = express()

app.use(cookieParser())
app.use(express.json())

// CORS

const allowedOrigins = [process.env.FRONTEND_URL ?? "http://localhost:5173"]
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
)

// Routes
app.use("/api", router)
app.use(notFound)
app.use(errorHandler)

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
})

io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie

    if (!cookieHeader) {
        return next(new Error("Authentication required"))
    }

    const { accessToken } = parseCookie(cookieHeader)

    if (!accessToken) {
        return next(new Error("Authentication required"))
    }

    try {
        const user = verifyAccessToken(accessToken)
        socket.user = user
        next()
    } catch (err) {
        return next(new Error("Invalid token"))
    }
})

io.on("connection", (socket) => {
    const user = socket.user
    console.log("a user connected : ", user)
})

server.listen(3000, () => {
    console.log("Server is running on port 3000")
})
