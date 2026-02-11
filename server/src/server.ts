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
import { SendMessageData, TypingData } from "@bchat/types"
import {
    InsertMessageSchema,
    GetMessageSchema,
    MessageSeenSchema,
    TypingSchema,
    NewDMSchema,
} from "@bchat/shared/validation"
import { and, eq, exists, inArray, isNull, or } from "drizzle-orm"
import { messageReceipts } from "../../packages/database/src/schemas/message-receipts"
import { sleep } from "@/utils/sleep"
import { getFriendsIds } from "@/queries/get-friends"

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

    const channels = await db.query.members.findMany({
        where: (members, { eq }) => eq(members.userId, user.id),
        columns: { channelId: true },
    })

    channels.forEach(({ channelId }) => {
        socket.join(`channel:${channelId}`)
    })

    const friendIds = await getFriendsIds(user.id)

    socket.join(`user:${user.id}`)

    friendIds.forEach((friendId) => {
        io.to(`user:${friendId}`).emit("user_status_changed", {
            userId: user.id,
            status: "online",
            lastSeen: new Date(),
        })
    })

    socket.on("send_message", async (msg: SendMessageData, callback) => {
        console.log("received msg :", msg)
        const result = InsertMessageSchema.safeParse(msg)

        if (!result.success) {
            throw new Error("Invalid message data on send_message event")
        }

        const { content, channelId, tempId } = result.data

        try {
            const channel = await db.query.channels.findFirst({
                where: (channels, { eq }) => eq(channels.id, channelId),
                with: {
                    members: true,
                },
            })
            if (!channel) throw new Error("Channel not found")

            const recipients = channel.members.filter(
                (m) => m.userId !== user.id,
            )

            await db.transaction(async (tx) => {
                const [message] = await tx
                    .insert(messages)
                    .values({
                        channelId,
                        content,
                        senderId: user.id,
                    })
                    .returning()

                let receipts
                // Note: group with 1 member -> 0 recipients
                if (recipients.length > 0) {
                    receipts = await tx
                        .insert(messageReceipts)
                        .values(
                            recipients.map((r) => ({
                                messageId: message.id,
                                userId: r.userId,
                            })),
                        )
                        .returning()
                }

                await sleep(200)

                // if (Math.random() > 0.5) {
                //     throw Error("test")
                // }

                io.to(`channel:${msg.channelId}`).emit("new_message", {
                    ...message,
                    receipts,
                })

                callback({
                    success: true,
                    messageId: message.id,
                    tempId,
                    channelId,
                })
            })
        } catch (err) {
            console.error(err)
            callback({
                success: false,
                tempId,
                channelId,
            })
        }
    })

    socket.on("get_message", async (data) => {
        console.log("message delivered : ", data)
        try {
            const { channelId, messageId, senderId } =
                GetMessageSchema.parse(data)

            const channel = await db.query.channels.findFirst({
                where: (channels, { eq }) => eq(channels.id, channelId),
            })

            if (!channel) throw new Error("Channel not found")

            await db
                .update(messageReceipts)
                .set({ deliveredAt: new Date() })
                .where(
                    and(
                        eq(messageReceipts.messageId, messageId),
                        eq(messageReceipts.userId, user.id),
                    ),
                )

            if (channel.type === "dm") {
                await db
                    .update(messages)
                    .set({ deliveredAt: new Date() })
                    .where(eq(messages.id, messageId))
            }

            io.to(`user:${senderId}`).emit("message_delivered", {
                messageId,
                receiverId: user.id,
                deliveredAt: new Date(),
                channelId: channel.id,
            })
        } catch (err) {
            console.error(err)
        }
    })

    socket.on("see_chat", async (data) => {
        try {
            const { channelId } = MessageSeenSchema.parse(data)

            const channel = await db.query.channels.findFirst({
                where: (channels, { eq }) => eq(channels.id, channelId),
            })

            if (!channel) throw new Error("Channel not found")

            const unreadMessages = await db.query.messages.findMany({
                where: and(
                    eq(messages.channelId, channelId),
                    exists(
                        db
                            .select()
                            .from(messageReceipts)
                            .where(
                                and(
                                    eq(messageReceipts.messageId, messages.id),
                                    eq(messageReceipts.userId, user.id),
                                    isNull(messageReceipts.seenAt),
                                ),
                            ),
                    ),
                ),
            })

            await db
                .update(messageReceipts)
                .set({ seenAt: new Date() })
                .where(
                    and(
                        inArray(
                            messageReceipts.messageId,
                            unreadMessages.map((m) => m.id),
                        ),
                        eq(messageReceipts.userId, user.id),
                    ),
                )

            if (channel.type === "dm") {
                await db
                    .update(messages)
                    .set({ seenAt: new Date() })
                    .where(
                        inArray(
                            messages.id,
                            unreadMessages.map((m) => m.id),
                        ),
                    )
            }

            unreadMessages.forEach((msg) => {
                io.to(`user:${msg.senderId}`).emit("chat_seen", {
                    messageId: msg.id, // what
                    userId: user.id, // who
                    seenAt: new Date(), // when
                    channelId: channel.id, // where
                })
            })
        } catch (error) {
            console.error(error)
        }
    })

    socket.on("send_typing", (data) => {
        try {
            const { channelId, userId, userName } = TypingSchema.parse(data)
            io.to(`channel:${data.channelId}`).emit("new_typing", {
                channelId,
                userId,
                userName,
            })
        } catch (err) {
            console.error(err)
        }
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

export function getUserSocket(userId: string) {
    const sockets = Array.from(io.sockets.sockets.values())
    return sockets.find((s) => s.user.id === userId)
}
