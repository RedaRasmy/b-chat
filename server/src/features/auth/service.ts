import { NotFoundError, UnauthorizedError } from "@/errors"
import { generateAccessToken } from "@/lib/jwt"
import { generateToken } from "@/utils/generate-token"
import { MONTH } from "@/utils/periods"
import db from "@bchat/database"
import { refreshTokens, users } from "@bchat/database/tables"
import { LoginCredentials, Profile, RegisterCredentials } from "@bchat/types"
import { compare, hash } from "bcryptjs"
import { count, eq } from "drizzle-orm"

let hasAdmin: boolean | null = null

export const authService = {
    async register({ email, password, name }: RegisterCredentials) {
        const hashedPassword = await hash(password, 12)

        if (hasAdmin === null) {
            const [userCount] = await db.select({ count: count() }).from(users)
            hasAdmin = userCount.count > 0
        }

        const [user] = await db
            .insert(users)
            .values({
                name,
                email,
                hashedPassword,
                role: hasAdmin ? "user" : "admin",
            })
            .returning()

        // ----- Auto Sign-in ------

        // Generate Tokens :

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        })

        const refreshToken = generateToken()

        // Store refreshToken

        await db.insert(refreshTokens).values({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + MONTH),
        })

        return {
            user,
            accessToken,
            refreshToken,
        }
    },

    async login({ email, password }: LoginCredentials) {
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        })
        if (!user || !user.hashedPassword) {
            throw new UnauthorizedError("Invalid credentials")
        }

        const isPasswordValid = await compare(password, user.hashedPassword)
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials")
        }

        // Generate Tokens :

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        })

        const refreshToken = generateToken()

        // Store refreshToken

        await db.insert(refreshTokens).values({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + MONTH),
        })

        return {
            user,
            accessToken,
            refreshToken,
        }
    },

    async refresh(refreshToken: string) {
        const token = await db.query.refreshTokens.findFirst({
            where: (tokens, { eq }) => eq(tokens.token, refreshToken),
            with: {
                user: true,
            },
        })

        if (!token) {
            throw new UnauthorizedError("Invalid refresh token")
        }

        const user = token.user

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        })

        return {
            user,
            accessToken,
        }
    },

    async logout(refreshToken: string) {
        const res = await db
            .delete(refreshTokens)
            .where(eq(refreshTokens.token, refreshToken))
        if (res.rowCount === 0) {
            throw new Error("Logout failed")
        }
    },

    async getProfile(userId: string) {
        const data = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
        })

        if (!data) {
            throw new NotFoundError("User not found")
        }

        const profile: Profile = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
        }

        return profile
    },
}
