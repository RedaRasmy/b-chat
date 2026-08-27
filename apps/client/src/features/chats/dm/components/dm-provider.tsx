import { useUser } from "@/features/auth/use-user"
import { DMContext } from "@/features/chats/dm/dm-context"
import type { DMChat, OtherUser } from "@bchat/types"
import type { ReactNode } from "react"

export function DMProvider({
    chat,
    children,
}: {
    chat: DMChat
    children: ReactNode
}) {
    const user = useUser()
    const friendMember = chat.members.find((mem) => mem.id !== user.id)

    if (!friendMember) {
        throw new Error("Friend not found")
    }

    const friend: OtherUser = {
        id: friendMember.id,
        name: friendMember.name,
        avatar: friendMember.avatar,
        role: friendMember.role,
    }

    return (
        <DMContext.Provider
            value={{
                chat,
                friend,
            }}
        >
            {children}
        </DMContext.Provider>
    )
}
