import { UserContext } from "@/features/auth/context"
import { useContext } from "react"

export function useUser() {
    const context = useContext(UserContext)
    if (!context) throw new Error("useUser must be used within UserProvider")
    return context
}
