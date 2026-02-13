import { useUser } from "@/features/auth/use-user"
import { GroupContext } from "@/features/chats/group-context"
import type { ChatMember, GroupChat } from "@bchat/types"
import { type ReactNode } from "react"

export function GroupProvider({
    chat,
    children,
    members,
}: {
    chat: GroupChat
    children: ReactNode
    members: Map<string, ChatMember>
}) {
    const user = useUser()
    const member = chat.members.find((mem) => mem.id === user.id)

    if (!member) {
        throw new Error("User is not a group member")
    }

    return (
        <GroupContext.Provider
            value={{
                chat,
                role: member.chatRole,
                members,
                isOwner: member.chatRole === "owner",
                isAdmin: member.chatRole === "admin",
                isMember: member.chatRole === "member",
            }}
        >
            {children}
        </GroupContext.Provider>
    )
}
