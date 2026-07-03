import { memberService } from "@/features/members/service"
import { emitToChannel, getUserSocket } from "@/socket"
import { makeEndpoint } from "@/utils/make-endpoint"
import {
    InsertMembersSchema,
    UpdateMemberSchema,
} from "@bchat/shared/validation"
import z from "zod"

export const addMembers = makeEndpoint(
    {
        params: z.object({
            channelId: z.uuid(),
        }),
        body: InsertMembersSchema,
    },
    async (req, res, next) => {
        const userId = req.user!.id
        const channelId = req.params.channelId
        const membersIds = req.body
        try {
            await memberService.createMember({
                userId,
                channelId,
                membersIds,
            })

            emitToChannel(channelId, "new_members")

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const updateMember = makeEndpoint(
    {
        params: z.object({
            channelId: z.uuid(),
            userId: z.uuid(),
        }),
        body: UpdateMemberSchema,
    },
    async (req, res, next) => {
        const user = req.user!
        const { channelId, userId } = req.params
        const { role } = req.body
        try {
            const { oldMember } = await memberService.updateMember({
                userId: user.id,
                targetId: userId,
                channelId,
                role,
            })

            emitToChannel(channelId, "role_changed", {
                userId: oldMember.userId,
                userName: oldMember.user.name,
                oldRole: oldMember.role,
                newRole: role,
            })

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const deleteMember = makeEndpoint(
    {
        params: z.object({
            channelId: z.uuid(),
            userId: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const { channelId, userId: targetId } = req.params
        const user = req.user!
        try {
            const member = await memberService.deleteMember({
                userId: user.id,
                targetId,
                channelId,
            })

            emitToChannel(channelId, "member_deleted", {
                userId: member.userId,
                userName: member.user.name,
            })

            const socket = getUserSocket(targetId)

            if (socket) {
                socket.leave(`channel:${channelId}`)
            }

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)

export const exitChannel = makeEndpoint(
    {
        params: z.object({
            channelId: z.uuid(),
        }),
    },
    async (req, res, next) => {
        const { channelId } = req.params
        const user = req.user!
        try {
            const member = await memberService.exitGroup(user.id, channelId)

            const socket = getUserSocket(user.id)

            if (socket) {
                socket.leave(`channel:${channelId}`)
            }

            emitToChannel(channelId, "member_left", {
                userId: member.userId,
                userName: member.user.name,
            })

            res.sendStatus(204)
        } catch (err) {
            next(err)
        }
    },
)
