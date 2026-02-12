import { makeParamsEndpoint } from "@/utils/wrappers"
import db from "@bchat/database"
import { members } from "@bchat/database/tables"
import { and, eq } from "drizzle-orm"

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
