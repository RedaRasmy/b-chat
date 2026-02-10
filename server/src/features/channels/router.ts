import {
    createDM,
    getChannels,
    getMessages,
    createGroup,
} from "@/features/channels/handlers"
import { Router } from "express"

const router = Router()

router.post("/dm", createDM)
router.post("/group", createGroup)
router.get("/", getChannels)
router.get("/:id/messages", getMessages)

export const channelsRouter = router
