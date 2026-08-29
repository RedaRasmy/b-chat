import { DMContext } from "@/features/chats/dm/dm-context"
import { useContext } from "react"

export function useDM() {
    const context = useContext(DMContext)
    if (!context) {
        throw new Error("useDM must be used within DMProvider")
    }
    return context
}
