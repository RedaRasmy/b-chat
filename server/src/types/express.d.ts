import "express"
import type { User } from "@bchat/shared/types"

declare module "express" {
    interface Request {
        user?: User
        validatedQuery?: any
    }
}

export {}
