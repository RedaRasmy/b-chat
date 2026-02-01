import logger from "../lib/logger"
import { makeSimpleEndpoint } from "@/utils/wrappers"

export const notFound = makeSimpleEndpoint((req, res, next) => {
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