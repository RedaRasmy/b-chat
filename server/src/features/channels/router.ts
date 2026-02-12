import {
    createDM,
    getChannels,
    getMessages,
    createGroup,
    deleteChannel,
} from "@/features/channels/handlers"
import { Router } from "express"

const router = Router()

router.post("/dm", createDM)
router.post("/group", createGroup)
router.get("/", getChannels)
router.get("/:id/messages", getMessages)
router.delete("/:id", deleteChannel)

export const channelsRouter = router
