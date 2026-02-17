import type { Request, Response, NextFunction } from "express"
import logger from "../lib/logger"
import { HttpError } from "@/errors"

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logger.error(
        {
            err,
            req: {
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: req.body,
            },
        },
        "Unhandled error",
    )
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            message: err.message,
        })
    }

    if (process.env.NODE_ENV === "production") {
        res.status(500).json({ message: "Internal server error" })
    } else {
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        })
    }
}
