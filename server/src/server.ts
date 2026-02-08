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
import db from "@bchat/database"
import { messages, users } from "@bchat/database/tables"
import { ClientMessage, TypingData } from "@bchat/types"
import { InsertMessageSchema } from "@bchat/shared/validation"
import { and, eq, or } from "drizzle-orm"

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

io.on("connection", async (socket) => {
    const user = socket.user
    console.log("a user connected : ", user)

    await db
        .update(users)
        .set({
            status: "online",
        })
        .where(eq(users.id, user.id))

    const userDMs = await db.query.dms.findMany({
        where: (dms, { eq, or }) =>
            or(eq(dms.user1Id, user.id), eq(dms.user2Id, user.id)),
        columns: { channelId: true },
    })

    userDMs.forEach((dm) => {
        socket.join(`channel:${dm.channelId}`)
    })

    const friendships = await db.query.friendships.findMany({
        where: (friendships, { and, eq, or }) =>
            and(
                or(
                    eq(friendships.requesterId, user.id),
                    eq(friendships.receiverId, user.id),
                ),
                eq(friendships.status, "friend"),
            ),
    })

    const friendIds = friendships.map((f) =>
        f.requesterId === user.id ? f.receiverId : f.requesterId,
    )

    socket.join(`user:${user.id}`)

    friendIds.forEach((friendId) => {
        io.to(`user:${friendId}`).emit("user_status_changed", {
            userId: user.id,
            status: "online",
            lastSeen: new Date(),
        })
    })

    socket.on("send_message", async (msg: ClientMessage) => {
        console.log("received msg :", msg)
        try {
            const { content, channelId } = InsertMessageSchema.parse(msg)

            const [message] = await db
                .insert(messages)
                .values({
                    channelId,
                    content,
                    senderId: user.id,
                })
                .returning()

            io.to(`channel:${msg.channelId}`).emit("new_message", message)
        } catch (err) {
            console.error(err)
        }
    })

    socket.on("send_typing", (data: TypingData) => {
        io.to(`channel:${data.channelId}`).emit("new_typing", data)
    })

    socket.on("disconnect", async () => {
        console.log(`User disconnected : `, user)
        try {
            await db
                .update(users)
                .set({
                    status: "offline",
                    lastSeen: new Date(),
                })
                .where(eq(users.id, user.id))

            friendIds.forEach((id) => {
                io.to(`user:${id}`).emit("user_status_changed", {
                    userId: user.id,
                    status: "offline",
                    lastSeen: new Date(),
                })
            })
        } catch (err) {
            console.error(err)
        }
    })
})

server.listen(3000, () => {
    console.log("Server is running on port 3000")
})
