import { makeEndpoint } from "@/utils/make-endpoint.js"
import logger from "../lib/logger.js"

export const notFound = makeEndpoint((req, res) => {
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
