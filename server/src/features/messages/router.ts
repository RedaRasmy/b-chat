import { deleteMessage } from "@/features/messages/controller"
import { Router } from "express"

const router = Router()

router.delete("/:id", deleteMessage)

export const messagesRouter = router
