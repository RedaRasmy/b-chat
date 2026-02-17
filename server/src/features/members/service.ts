import { BadRequestError, ForbiddenError, NotFoundError } from "@/errors"
import { channelService } from "@/features/channels/service"
import db from "@bchat/database"
import { Member, members } from "@bchat/database/tables"
import { IMember } from "@bchat/types"
import { and, eq, inArray } from "drizzle-orm"

class MemberService {
    async createMember({
        userId,
        channelId,
        membersIds,
    }: {
        userId: string
        channelId: string
        membersIds: string[]
    }) {
        const channel = await channelService.getChannelWithMembers(channelId)

        if (!channel) {
            throw new NotFoundError("Channel not found")
        }

        const member = channel.members.find(
            (member) => member.userId === userId,
        )

        if (!member || member.role === "member" || channel.type !== "group") {
            throw new ForbiddenError("Action not allowed")
        }
        const existingMemberIds = new Set(channel.members.map((m) => m.userId))
        const oldMembers = channel.members
            .filter(
                (mem) =>
                    membersIds.includes(mem.userId) && mem.status === "removed",
            )
            .map((m) => m.userId)
        const newMembers = membersIds.filter((id) => !existingMemberIds.has(id))

        if (newMembers.length > 0) {
            const values: IMember[] = newMembers.map((id) => ({
                channelId,
                userId: id,
            }))
            await db.insert(members).values(values)
        }

        if (oldMembers.length > 0) {
            await db
                .update(members)
                .set({
                    status: "active",
                })
                .where(
                    and(
                        eq(members.channelId, channelId),
                        inArray(members.userId, oldMembers),
                    ),
                )
        }
    }

    async updateMember({
        userId,
        targetId,
        channelId,
        role,
    }: {
        userId: string
        targetId: string
        channelId: string
        role: Member["role"]
    }) {
        const channel = await db.query.channels.findFirst({
            where: (channels, { eq }) => eq(channels.id, channelId),
            with: {
                members: {
                    columns: {
                        userId: true,
                        role: true,
                    },
                    where: (members, { eq }) => eq(members.status, "active"),
                    with: {
                        user: {
                            columns: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        if (!channel) {
            throw new NotFoundError("Channel not found")
        }

        const member = channel.members.find(
            (member) => member.userId === userId,
        )
        const targetMember = channel.members.find(
            (member) => member.userId === targetId,
        )

        if (!targetMember) {
            throw new NotFoundError("Member not found")
        }

        if (!member || member.role !== "owner" || channel.type !== "group") {
            throw new ForbiddenError("Action not allowed")
        }

        await db
            .update(members)
            .set({
                role,
            })
            .where(
                and(
                    eq(members.channelId, channelId),
                    eq(members.userId, targetId),
                ),
            )
        return {
            oldMember: targetMember,
        }
    }

    async getGroupMembersWithNames(channelId: string) {
        return await db.query.channels.findFirst({
            where: (chs, { eq, and }) =>
                and(eq(chs.id, channelId), eq(chs.type, "group")),
            with: {
                members: {
                    with: {
                        user: {
                            columns: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })
    }

    async deleteMember({
        userId,
        targetId,
        channelId,
    }: {
        userId: string
        targetId: string
        channelId: string
    }) {
        const group = await this.getGroupMembersWithNames(channelId)

        if (!group) {
            throw new NotFoundError("Group not found")
        }
        const member = group.members.find((mem) => mem.userId === userId)
        const targetMember = group.members.find(
            (mem) => mem.userId === targetId,
        )

        if (!targetMember || targetMember.status !== "active") {
            throw new NotFoundError("Member not found")
        }

        if (
            !member ||
            member.role === "member" ||
            (member.role === "admin" && targetMember.role === "admin") ||
            targetMember.role === "owner"
        ) {
            throw new ForbiddenError("Action not allowed")
        }

        await db
            .update(members)
            .set({
                status: "removed",
            })
            .where(
                and(
                    eq(members.channelId, channelId),
                    eq(members.userId, targetId),
                ),
            )

        return targetMember
    }

    async exitGroup(userId: string, channelId: string) {
        const group = await this.getGroupMembersWithNames(channelId)
        if (!group) {
            throw new NotFoundError("Group not found")
        }
        const member = group.members.find((mem) => mem.userId === userId)

        if (!member) {
            throw new BadRequestError("You are not a member")
        }

        if (member.role === "owner") {
            throw new ForbiddenError("Group owner can't leave the group")
        }

        await db
            .update(members)
            .set({
                status: "removed",
            })
            .where(
                and(
                    eq(members.channelId, channelId),
                    eq(members.userId, userId),
                ),
            )

        return member
    }
}

export const memberService = new MemberService()
