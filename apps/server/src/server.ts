import http from "http"
import { createApp } from "@/app.js"
import { setupSocketIO } from "@/socket/index.js"
import logger from "@/lib/logger.js"

const PORT = process.env.PORT || 3000

const app = createApp()
const server = http.createServer(app)
setupSocketIO(server)

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})
