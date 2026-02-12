import {
    makeBodyEndpoint,
    makeParamsBodyEndpoint,
    makeParamsEndpoint,
} from "@/utils/wrappers"
import db from "@bchat/database"
import { IMember, members } from "@bchat/database/tables"
import { InsertMemberSchema } from "@bchat/shared/validation"
import { and, eq } from "drizzle-orm"

export const addMembers = makeParamsBodyEndpoint(
    ["channelId"],
    InsertMemberSchema,
    async (req, res, next) => {
        const user = req.user!
        const channelId = req.params.channelId
        const data = req.body
        try {
            const channel = await db.query.channels.findFirst({
                where: (channels, { eq }) => eq(channels.id, channelId),
                with: {
                    members: {
                        columns: {
                            userId: true,
                            role: true,
                        },
                    },
                },
            })

            if (!channel) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }

            const member = channel.members.find(
                (member) => (member.userId = user.id),
            )

            if (
                !member ||
                member.role === "member" ||
                channel.type !== "group"
            ) {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            const memberIds = channel.members.map((mem) => mem.userId)

            const values: IMember[] = data
                .filter((mem) => !memberIds.includes(mem.userId))
                .map((member) => ({
                    channelId,
                    userId: member.userId,
                    role: member.role,
                }))

            await db.insert(members).values(values)
            
        } catch (err) {
            next(err)
        }
    },
)

export const deleteMember = makeParamsEndpoint(
    ["channelId", "userId"],
    async (req, res, next) => {
        const { channelId, userId } = req.params
        const user = req.user!
        try {
            const member = await db.query.members.findFirst({
                where: (members, { eq, and }) =>
                    and(
                        eq(members.channelId, channelId),
                        eq(members.userId, user.id),
                    ),
            })
            if (!member) {
                return res.status(404).json({
                    message: "Channel not found",
                })
            }
            if (member.role === "member") {
                return res.status(403).json({
                    message: "Action not allowed",
                })
            }

            await db
                .delete(members)
                .where(
                    and(
                        eq(members.channelId, channelId),
                        eq(members.userId, userId),
                    ),
                )

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
