import jwt from "jsonwebtoken"
import type { User } from "@bchat/shared/types"

export type AccessTokenPayload = Pick<User, "id" | "email" | "role">

export const generateAccessToken = (data: AccessTokenPayload): string => {
    return jwt.sign(data, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" })
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!,
    ) as AccessTokenPayload
}