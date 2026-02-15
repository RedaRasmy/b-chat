import type { ChatMember } from "@bchat/types"

export function sortMembers(userId: string) {
    return function (a: ChatMember, b: ChatMember) {
        if (a.chatRole === "owner") {
            return -1
        }
        if (b.chatRole === "owner") {
            return 1
        }

        if (a.chatRole === "admin" && b.chatRole === "admin") {
            if (a.id === userId) {
                return -1
            }
            if (b.id === userId) {
                return 1
            }
        }

        if (a.chatRole === "admin") {
            return -1
        }
        if (b.chatRole === "admin") {
            return 1
        }
        if (a.id === userId) {
            return -1
        }
        if (b.id === userId) {
            return 1
        }

        if (a.joinedAt < b.joinedAt) {
            return -1
        } else if (a.joinedAt > b.joinedAt) return 1

        return 0
    }
}
