import {
    addMembers,
    deleteMember,
    updateMember,
} from "@/features/members/handlers"
import { Router } from "express"

const router = Router()

router.post("/:channelId", addMembers)
router.patch("/:channelId/:userId", updateMember)
router.delete("/:channelId/:userId", deleteMember)

export const membersRouter = router
