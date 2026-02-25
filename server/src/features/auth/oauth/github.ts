import { eq } from "drizzle-orm"
import db from "@bchat/database"
import { getRefreshTokenOptions, getAccessTokenOptions } from "../options"
import { refreshTokens, users } from "@bchat/database/tables"
import { generateAccessToken } from "@/lib/jwt"
import { generateToken } from "@/utils/generate-token"
import { MONTH } from "@/utils/periods"
import { makeEndpoint } from "@/utils/make-endpoint"

export const githubLogin = makeEndpoint(async (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: process.env.GITHUB_CALLBACK_URL!,
        scope: "user:email",
    }).toString()

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params}`

    res.redirect(githubAuthUrl)
})

export const githubCallback = makeEndpoint(async (req, res, next) => {
    const { code } = req.query

    try {
        const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                }),
            },
        )

        const { access_token } = await tokenResponse.json()

        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })

        const githubUser = await userResponse.json()

        const emailResponse = await fetch(
            "https://api.github.com/user/emails",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            },
        )
        const emails = await emailResponse.json()

        const primaryEmailObject =
            emails.find((email: any) => email.primary && email.verified) ||
            emails.find((email: any) => email.verified)

        const primaryEmail = primaryEmailObject.email
        const githubId = githubUser.id.toString()

        if (!primaryEmail) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=no_email`,
            )
        }

        let user = await db.query.users.findFirst({
            where: (users, { eq, or }) =>
                or(eq(users.githubId, githubId), eq(users.email, primaryEmail)),
        })

        if (user) {
            await db
                .update(users)
                .set({
                    githubId,
                    avatar: githubUser.avatar_url,
                })
                .where(eq(users.id, user.id))
        }

        if (!user) {
            const [newUser] = await db
                .insert(users)
                .values({
                    name: githubUser.login,
                    email: primaryEmail,
                    githubId: githubUser.id.toString(),
                    avatar: githubUser.avatar_url,
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

        res.cookie("accessToken", accessToken, getAccessTokenOptions(req))
        res.cookie("refreshToken", refreshToken, getRefreshTokenOptions(req))

        res.redirect(`${process.env.FRONTEND_URL}`)
    } catch (err) {
        console.error("GitHub OAuth error:", err)
        return res.redirect(
            `${process.env.FRONTEND_URL}/auth/login?error=github_auth_failed`,
        )
    }
})
