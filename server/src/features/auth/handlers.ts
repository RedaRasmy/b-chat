import db from "@bchat/database"
import { LoginSchema, RegisterSchema } from "@bchat/shared/validation"
import { makeBodyEndpoint, makeSimpleEndpoint } from "@/utils/wrappers"
import { compare, hash } from "bcryptjs"
import { refreshTokens, users } from "@bchat/database/tables"
import { generateAccessToken } from "@/lib/jwt"
import { generateToken } from "@/utils/generate-token"
import { count, eq } from "drizzle-orm"
import { accessTokenOptions, refreshTokenOptions } from "./options"
import { MONTH } from "@/utils/periods"

let hasAdmin: boolean | null = null

export const register = makeBodyEndpoint(
    RegisterSchema,
    async (req, res, next) => {
        const { email, password, name } = req.body

        try {
            const hashedPassword = await hash(password, 12)

            if (hasAdmin === null) {
                const [userCount] = await db
                    .select({ count: count() })
                    .from(users)
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

            // Set Cookies

            res.cookie("accessToken", accessToken, accessTokenOptions)
            res.cookie("refreshToken", refreshToken, refreshTokenOptions)

            // -----------------------------

            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                avatar: user.avatar,
            })
        } catch (error) {
            next(error)
        }
    },
)

export const login = makeBodyEndpoint(LoginSchema, async (req, res, next) => {
    const { email, password } = req.body

    try {
        // Validate Credentials

        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        })
        if (!user || !user.hashedPassword) {
            return res.status(401).json({
                message: "Invalid credentials",
            })
        }

        const isPasswordValid = await compare(password, user.hashedPassword)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            })
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

        // Set Cookies

        res.cookie("accessToken", accessToken, accessTokenOptions)
        res.cookie("refreshToken", refreshToken, refreshTokenOptions)

        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            avatar: user.avatar,
        })
    } catch (error) {
        next(error)
    }
})

export const refresh = makeSimpleEndpoint(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not provided",
        })
    }

    try {
        const session = await db.query.refreshTokens.findFirst({
            where: (tokens, { eq }) => eq(tokens.token, refreshToken),
            with: {
                user: true,
            },
        })

        if (!session) {
            return res.status(401).json({
                message: "Invalid refresh token",
            })
        }
        const user = session.user

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        })

        res.cookie("accessToken", accessToken)

        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            avatar: user.avatar,
        })
    } catch (error) {
        next(error)
    }
})

export const logout = makeSimpleEndpoint(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not provided",
        })
    }

    try {
        if (refreshToken) {
            await db
                .delete(refreshTokens)
                .where(eq(refreshTokens.token, refreshToken))
        }

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.status(200).json({
            message: "User logged out successfully",
        })
    } catch (err) {
        next(err)
    }
})

export const fetchMe = makeSimpleEndpoint(async (req, res, next) => {
    const session = req.user!

    try {
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, session.id),
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
})
