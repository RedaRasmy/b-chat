import { ToRecord } from "@bchat/types"
import type { NextFunction, Request, Response } from "express"
import { z } from "zod"

/*
    Simple 
    Params
    Body
    Query 
    Auth
*/

/// SIMPLE

export function makeSimpleEndpoint(
    callback: (req: Request, res: Response, next: NextFunction) => void,
) {
    return callback
}

/// PARAMS

function compareArrays(a: unknown[], b: unknown[]): boolean {
    if (a.length !== b.length) return false

    const aSorted = [...a].sort()
    const bSorted = [...b].sort()

    return aSorted.every((val, idx) => val === bSorted[idx])
}

export function makeParamsEndpoint<T extends readonly string[]>(
    params: [...T],
    callback: (
        req: Request<ToRecord<T>>,
        res: Response,
        next: NextFunction,
    ) => void,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        /// validate
        const isGood = compareArrays(params, Object.keys(req.params))

        if (!isGood) {
            return res.status(400).send({
                message: "Invalid search params",
            })
        }
        return callback(req as Request<ToRecord<T>>, res, next)
    }
}

/// BODY

export function makeBodyEndpoint<Body>(
    schema: z.ZodType<Body>,
    callback: (
        req: Request<any, any, Body>,
        res: Response,
        next: NextFunction,
    ) => void,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).send({
                message: "Invalid body",
                details: result.error.issues,
            })
        }

        req.body = result.data

        return callback(req as Request<any, any, Body>, res, next)
    }
}

/// QUERY

interface ValidatedQueryRequest<T> extends Request<any, any, any, T> {
    validatedQuery: T
}

export function makeQueryEndpoint<Query>(
    schema: z.ZodType<Query>,
    callback: (
        req: ValidatedQueryRequest<Query>,
        res: Response,
        next: NextFunction,
    ) => void,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query)

        if (!result.success) {
            return res.status(400).send({
                message: "Invalid query params",
                details: result.error.issues,
            })
        }

        // req.validatedQuery = result.data
        ;(req as ValidatedQueryRequest<Query>).validatedQuery = result.data

        return callback(req as ValidatedQueryRequest<Query>, res, next)
    }
}

/// AUTH

// type User = {
//     id: string
//     role: string
//     email: string
// }

// type AuthRequest = Prettify<Omit<Request, "user"> & { user: User }>

// export function makeAuthEndpoint(
//     callback: (req: AuthRequest, res: Response, next: NextFunction) => void,
// ) {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const user = req.user

//         if (!user) {
//             return res.status(403).send({
//                 message: "Unauthorized",
//             })
//         }

//         return callback(req as AuthRequest, res, next)
//     }
// }

export function makeByIdEndpoint(
    callback: (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction,
    ) => void,
) {
    return makeParamsEndpoint(["id"], callback)
}

export function makeIdBodyEndpoint<Body>(
    schema: z.ZodType<Body>,
    callback: (
        req: Request<{ id: string }, any, Body>,
        res: Response,
        next: NextFunction,
    ) => void,
) {
    return makeParamsEndpoint(["id"], makeBodyEndpoint(schema, callback))
}

export function makeIdQueryEndpoint<Query>(
    schema: z.ZodType<Query>,
    callback: (
        req: Request<{ id: string }, any, any, Query>,
        res: Response,
        next: NextFunction,
    ) => void,
) {
    return makeParamsEndpoint(["id"], makeQueryEndpoint(schema, callback))
}
