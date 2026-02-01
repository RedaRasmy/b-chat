import http from "http"
import express from "express"
import cors from "cors"
import { router } from "./router"
import cookieParser from "cookie-parser"

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

const server = http.createServer(app)

server.listen(3000, () => {
    console.log("Server is running on port 3000")
})
