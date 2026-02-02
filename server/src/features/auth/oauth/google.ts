import { eq } from "drizzle-orm"
import { accessTokenOptions, refreshTokenOptions } from "../options"
import { makeSimpleEndpoint } from "@/utils/wrappers"
import { refreshTokens, users } from "@bchat/database/tables"
import db from "@bchat/database"
import { generateAccessToken } from "@/lib/jwt"
import { generateToken } from "@/utils/generate-token"
import { MONTH } from "@/utils/periods"

export const googleLogin = makeSimpleEndpoint(async (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
        response_type: "code",
        scope: "email profile",
    }).toString()

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`

    res.redirect(googleAuthUrl)
})

export const googleCallback = makeSimpleEndpoint(async (req, res, next) => {
    const { code } = req.query

    try {
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
                    code,
                    grant_type: "authorization_code",
                }),
            },
        )

        const { access_token } = await tokenResponse.json()

        const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            },
        )

        const googleUser = await userResponse.json()

        // googleUser contains:
        // { id, email, name, picture, verified_email }

        let user = await db.query.users.findFirst({
            where: eq(users.googleId, googleUser.id),
        })

        if (!user) {
            const [newUser] = await db
                .insert(users)
                .values({
                    name: googleUser.name,
                    email: googleUser.email,
                    googleId: googleUser.id,
                    avatar: googleUser.picture,
                })
                .returning()
            user = newUser
        }

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        })
        const refreshToken = generateToken()

        await db.insert(refreshTokens).values({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + MONTH),
        })

        res.cookie("accessToken", accessToken, accessTokenOptions)
        res.cookie("refreshToken", refreshToken, refreshTokenOptions)

        res.redirect(`${process.env.FRONTEND_URL}/profile`)
    } catch (err) {
        next(err)
    }
})
