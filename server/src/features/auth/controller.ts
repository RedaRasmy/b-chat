import { LoginSchema, RegisterSchema } from "@bchat/shared/validation"
import { getRefreshTokenOptions, getAccessTokenOptions } from "./options"
import { authService } from "@/features/auth/service"
import { makeEndpoint } from "@/utils/make-endpoint"

export const register = makeEndpoint(
    {
        body: RegisterSchema,
    },
    async (req, res, next) => {
        try {
            const { user, accessToken, refreshToken } =
                await authService.register(req.body)

            res.cookie("accessToken", accessToken, getAccessTokenOptions(req))
            res.cookie(
                "refreshToken",
                refreshToken,
                getRefreshTokenOptions(req),
            )

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

export const login = makeEndpoint(
    {
        body: LoginSchema,
    },
    async (req, res, next) => {
        try {
            const { user, accessToken, refreshToken } = await authService.login(
                req.body,
            )

            res.cookie("accessToken", accessToken, getAccessTokenOptions(req))
            res.cookie(
                "refreshToken",
                refreshToken,
                getRefreshTokenOptions(req),
            )

            res.json({
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

export const refresh = makeEndpoint(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken || typeof refreshToken !== "string") {
        return res.status(400).json({
            message: "Refresh token not provided",
        })
    }

    try {
        const { user, accessToken } = await authService.refresh(refreshToken)

        res.cookie("accessToken", accessToken, getAccessTokenOptions(req))

        res.json({
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

export const logout = makeEndpoint(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken

    res.clearCookie("accessToken", getAccessTokenOptions(req))
    res.clearCookie("refreshToken", getRefreshTokenOptions(req))

    if (!refreshToken || typeof refreshToken !== "string") {
        return res.sendStatus(204)
    }

    try {
        await authService.logout(refreshToken)
        res.sendStatus(204)
    } catch (err) {
        next(err)
    }
})

export const fetchMe = makeEndpoint(async (req, res, next) => {
    const user = req.user!

    try {
        const profile = await authService.getProfile(user.id)

        res.json(profile)
    } catch (error) {
        next(error)
    }
})
