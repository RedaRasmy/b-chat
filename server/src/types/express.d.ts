import "express"
import type { AccessTokenPayload } from "@/lib/jwt"

declare module "express" {
    interface Request {
        user?: AccessTokenPayload
        validatedQuery?: any
    }
}

export {}
