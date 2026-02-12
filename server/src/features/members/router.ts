import {
    addMembers,
    deleteMember,
    exitChannel,
    updateMember,
} from "@/features/members/handlers"
import { Router } from "express"

const router = Router()

router.post("/:channelId", addMembers)
router.patch("/:channelId/:userId", updateMember)
router.delete("/:channelId/:userId", deleteMember)
router.delete("/:channelId", exitChannel)

export const membersRouter = router
