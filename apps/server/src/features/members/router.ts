import {
    addMembers,
    deleteMember,
    exitChannel,
    updateMember,
} from "@/features/members/controller.js"
import { Router } from "express"

const router = Router()

router.post("/:channelId", addMembers)
router.patch("/:channelId/:userId", updateMember)
router.delete("/:channelId/:userId", deleteMember)
router.delete("/:channelId", exitChannel)

export const membersRouter: Router = router
