import { useUser } from "@/features/auth/use-user"
import { GroupContext } from "@/features/chats/group-context"
import type { GroupChat } from "@bchat/types"
import { useMemo, type ReactNode } from "react"

export function GroupProvider({
    chat,
    children,
}: {
    chat: GroupChat
    children: ReactNode
}) {
    const user = useUser()
    const member = chat.members.find((mem) => mem.id === user.id)

    if (!member) {
        throw new Error("User is not a group member")
    }

    const members = useMemo(() => {
        return new Map(chat.members.map((m) => [m.id, m]))
    }, [chat])

    return (
        <GroupContext.Provider
            value={{
                chat,
                role: member.chatRole,
                members,
            }}
        >
            {children}
        </GroupContext.Provider>
    )
}
