import { GroupContext } from "@/features/chats/groups/group-context"
import { useContext } from "react"

export function useGroup() {
    const context = useContext(GroupContext)
    if (!context) {
        throw new Error("useGroup must be used within GroupProvider")
    }
    return context
}
