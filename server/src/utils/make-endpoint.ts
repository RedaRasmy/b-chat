import type { NextFunction, Request, Response } from "express"
import z from "zod"

export function makeEndpoint<Params, Query, Body>(
    {
        params,
        query,
        body,
    }: {
        params?: z.ZodType<Params>
        query?: z.ZodType<Query>
        body?: z.ZodType<Body>
    },
    callback: (
        req: Request<Params, any, Body, Query>,
        res: Response,
        next: NextFunction,
    ) => void,
): (req: Request, res: Response, next: NextFunction) => void

export function makeEndpoint(
    callback: (req: Request, res: Response, next: NextFunction) => void,
): (req: Request, res: Response, next: NextFunction) => void

export function makeEndpoint<Params, Query, Body>(
    schemaOrCallback:
        | {
              params?: z.ZodType<Params>
              query?: z.ZodType<Query>
              body?: z.ZodType<Body>
          }
        | ((req: Request, res: Response, next: NextFunction) => void),
    callback?: (
        req: Request<Params, any, Body, Query>,
        res: Response,
        next: NextFunction,
    ) => void,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (typeof schemaOrCallback === "function") {
            return schemaOrCallback(req, res, next)
        }
        const { body, params, query } = schemaOrCallback
        const handler = callback!

        if (body) {
            const result = body.safeParse(req.body)
            if (!result.success) {
                return res.status(400).send({
                    message: "Invalid body data",
                    details: result.error.issues,
                })
            }
            req.body = result.data
        }
        if (query) {
            const result = query.safeParse(req.query)

            if (!result.success) {
                return res.status(400).send({
                    message: "Invalid query params",
                    details: result.error.issues,
                })
            }
            Object.defineProperty(req, "query", {
                value: result.data,
                writable: true,
                configurable: true,
            })
        }

        if (params) {
            const result = params.safeParse(req.params)

            if (!result.success) {
                return res.status(400).send({
                    message: "Invalid params",
                    details: result.error.issues,
                })
            }

            req.params = result.data as any
        }

        return handler(req as Request<Params, any, Body, Query>, res, next)
    }
}

// const test = makeEndpoint(
//     {
//         params: z.object({
//             someId: z.coerce.number(),
//         }),
//     },
//     async (req, res, next) => {
//         req.body
//         req.query
//         req.params.someId
//     },
// )
