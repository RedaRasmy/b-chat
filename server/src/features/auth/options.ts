import { MONTH } from "@/utils/periods"
import { CookieOptions } from "express"

export const accessTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000, // 15min,
}

export const refreshTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: MONTH,
}
