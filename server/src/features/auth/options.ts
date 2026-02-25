import { allowedOrigins } from "@/config/allowed-origins"
import { MONTH } from "@/utils/periods"
import { Request, CookieOptions } from "express"

function getCookieOptions<P, ResBody, ReqBody, ReqQuery>(
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    maxAge: number,
): CookieOptions {
    const isProduction = process.env.NODE_ENV === "production"

    const requestOrigin = req.get("origin") || req.get("referer") || ""

    if (!requestOrigin) {
        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge,
        }
    }

    const isSameOrigin = allowedOrigins.some((domain) =>
        requestOrigin.startsWith(domain),
    )

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isSameOrigin ? "none" : "lax",
        maxAge,
    }
}

export function getAccessTokenOptions<P, ResBody, ReqBody, ReqQuery>(
    req: Request<P, ResBody, ReqBody, ReqQuery>,
) {
    return getCookieOptions(req, 15 * 60 * 1000)
}

export function getRefreshTokenOptions<P, ResBody, ReqBody, ReqQuery>(
    req: Request<P, ResBody, ReqBody, ReqQuery>,
) {
    return getCookieOptions(req, MONTH)
}
