import type { NextFunction, Request, Response } from "express"
import { verifyAccessToken } from "../lib/jwt"
import { User } from "@bchat/types"

export const requireAuth = (requiredRole?: User["role"]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken

        if (!token) {
            return res.status(401).json({ message: "Access Token is missing" })
        }

        try {
            const decoded = verifyAccessToken(token)

            req.user = decoded

            // Check role if specified
            if (requiredRole && decoded.role !== requiredRole) {
                return res
                    .status(403)
                    .json({ message: `${requiredRole} access required` })
            }

            next()
        } catch (error) {
            res.status(401).json({ message: "Invalid token" })
        }
    }
}
