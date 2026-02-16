import { Socket } from "socket.io"
import { parseCookie } from "cookie"
import { verifyAccessToken } from "@/lib/jwt"
import db from "@bchat/database"

export async function socketAuthMiddleware(
    socket: Socket,
    next: (err?: Error) => void,
) {
    const cookieHeader = socket.handshake.headers.cookie

    if (!cookieHeader) {
        return next(new Error("Authentication required"))
    }

    const { accessToken } = parseCookie(cookieHeader)

    if (!accessToken) {
        return next(new Error("Authentication required"))
    }

    try {
        const { id } = verifyAccessToken(accessToken)

        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, id),
            columns: {
                id: true,
                name: true,
                avatar: true,
                email: true,
                role: true,
            },
        })

        if (!user) return next(new Error("User not found"))

        socket.user = user

        next()
    } catch (err) {
        return next(new Error("Invalid token"))
    }
}
