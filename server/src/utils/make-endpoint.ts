/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessTokenPayload } from "@/lib/jwt"
import logger from "@/lib/logger"
import type { NextFunction, Request, Response } from "express"
import z from "zod"

type User<U extends boolean> = U extends true
    ? AccessTokenPayload
    : U extends false
      ? undefined
      : AccessTokenPayload | undefined

export function makeEndpoint<Params, Query, Body, U extends boolean>(
    {
        params,
        query,
        body,
        user,
    }: {
        params?: z.ZodType<Params>
        query?: z.ZodType<Query>
        body?: z.ZodType<Body>
        user?: U
    },
    callback: (
        req: Request<Params, any, Body, Query> & { user: User<U> },
        res: Response,
        next: NextFunction,
    ) => void,
): (req: Request, res: Response, next: NextFunction) => void

export function makeEndpoint(
    callback: (req: Request, res: Response, next: NextFunction) => void,
): (req: Request, res: Response, next: NextFunction) => void

export function makeEndpoint<Params, Query, Body, U extends boolean>(
    schemaOrCallback:
        | {
              params?: z.ZodType<Params>
              query?: z.ZodType<Query>
              body?: z.ZodType<Body>
              user?: U
          }
        | ((req: Request, res: Response, next: NextFunction) => void),
    callback?: (
        req: Request<Params, any, Body, Query> & { user: User<U> },
        res: Response,
        next: NextFunction,
    ) => void,
) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (typeof schemaOrCallback === "function") {
            return schemaOrCallback(req, res, next)
        }
        const { body, params, query, user } = schemaOrCallback
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

        if (user) {
            if (!req.user) {
                logger.fatal(
                    "makeEndpoint: req.user is undefined, you must use auth middleware",
                )
                return res.sendStatus(500)
            }
        }
        if (user === false && req.user !== undefined) {
            logger.warn(
                "makeEndoint: req.user is defined where user is set to false",
            )
        }

        return handler(
            req as Request<Params, any, Body, Query> & {
                user: User<U>
            },
            res,
            next,
        )
    }
}

// const test = makeEndpoint(
//     {
//         params: z.object({
//             someId: z.coerce.number(),
//         }),
//         // user: false,
//     },
//     async (req, res, next) => {
//         req.body
//         req.query
//         req.params.someId

//         const user = req.user
//     },
// )
