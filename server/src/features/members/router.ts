import { addMembers, deleteMember } from "@/features/members/handlers"
import { Router } from "express"

const router = Router()

router.post("/:channelId", addMembers)
// router.patch("/:channelId/:userId")  // change role
router.delete("/:channelId/:userId", deleteMember)

export const membersRouter = router
