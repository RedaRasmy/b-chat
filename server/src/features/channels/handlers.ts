import {
    makeBodyEndpoint,
    makeParamsEndpoint,
    makeSimpleEndpoint,
} from "@/utils/wrappers"
import db from "@bchat/database"
import { channels, dms } from "@bchat/database/tables"
import { InsertDMSchema } from "@bchat/shared/validation"

export const createDM = makeBodyEndpoint(
    InsertDMSchema,
    async (req, res, next) => {
        const userId = req.user!.id
        const { friendId } = req.body

        try {
            await db.transaction(async (tx) => {
                const [channel] = await tx
                    .insert(channels)
                    .values({
                        type: "dm",
                    })
                    .returning()

                const [dm] = await tx
                    .insert(dms)
                    .values({
                        channelId: channel.id,
                        user1Id: userId,
                        user2Id: friendId,
                    })
                    .returning()
                res.status(201).json(dm)
            })
        } catch (err) {
            next(err)
        }
    },
)

export const getChannels = makeSimpleEndpoint(async (req, res, next) => {
    const { id: userId } = req.user!

    try {
        const dms = await db.query.dms.findMany({
            where: (dms, { eq, or }) =>
                or(eq(dms.user1Id, userId), eq(dms.user2Id, userId)),
            with: {
                user1: {
                    columns: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                        status: true,
                        lastSeen: true,
                    },
                },
                user2: {
                    columns: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                        status: true,
                        lastSeen: true,
                    },
                },
            },
        })

        const finalData = {
            dms: dms.map((dm) => ({
                id: dm.channelId,
                friend: dm.user1Id === userId ? dm.user2 : dm.user1,
            })),
        }

        res.json(finalData)
    } catch (err) {
        next(err)
    }
})

export const getMessages = makeParamsEndpoint(
    ["id"],
    async (req, res, next) => {
        const id = req.params.id
        const user = req.user!

        try {
            const userChannel = await db.query.dms.findFirst({
                where: (dms, { eq, and, or }) =>
                    and(
                        eq(dms.channelId, id),
                        or(eq(dms.user1Id, user.id), eq(dms.user2Id, user.id)),
                    ),
            })
            if (!userChannel) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }
            const messages = await db.query.messages.findMany({
                where: (msgs, { eq }) => eq(msgs.channelId, id),
            })

            res.json(messages)
        } catch (err) {
            next(err)
        }
    },
)
