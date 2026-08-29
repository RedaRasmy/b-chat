import { deleteMessage } from "@/features/messages/controller.js"
import { Router } from "express"

const router = Router()

router.delete("/:id", deleteMessage)

export const messagesRouter: Router = router
