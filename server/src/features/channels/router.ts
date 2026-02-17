import {
    createDM,
    getChannels,
    getMessages,
    createGroup,
    deleteChannel,
    updateGroup,
} from "@/features/channels/controller"
import { Router } from "express"

const router = Router()

router.post("/dms", createDM)
router.post("/groups", createGroup)
router.get("/", getChannels)
router.get("/:id/messages", getMessages)
router.delete("/:id", deleteChannel)
router.patch("/groups/:id", updateGroup)

export const channelsRouter = router
