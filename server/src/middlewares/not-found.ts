import { makeEndpoint } from "@/utils/make-endpoint"
import logger from "../lib/logger"

export const notFound = makeEndpoint((req, res, next) => {
    logger.error(
        {
            request: {
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: req.body,
            },
        },
        "Route not found",
    )
    res.status(404).json({
        message: "Route not found",
    })
})