import type { DMChat, OtherUser } from "@bchat/shared/types"
import { createContext } from "react"

type DMContextValue = {
    chat: DMChat
    friend: OtherUser
}

export const DMContext = createContext<DMContextValue | null>(null)
