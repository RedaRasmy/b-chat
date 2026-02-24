import logger from "@/lib/logger"
import db from "@bchat/database"
import { channels, users } from "@bchat/database/tables"
import bcrypt from "bcryptjs"
import { Router } from "express"

const router = Router()

router.post("/seed", async (req, res, next) => {
    try {
        await db.delete(users)
        await db.delete(channels)
        await db.insert(users).values([
            {
                name: "reda",
                email: "reda@example.com",
                hashedPassword: await bcrypt.hash("password", 12),
                role: "admin",
            },
            {
                name: "ahmed",
                email: "ahmed@example.com",
                hashedPassword: await bcrypt.hash("password", 12),
            },
            {
                name: "omar",
                email: "omar@example.com",
                hashedPassword: await bcrypt.hash("password", 12),
            },
        ])

        res.sendStatus(204)
        logger.info("db reset")
    } catch (err) {
        next(err)
    }
})

export const testRouter = router
