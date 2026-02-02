import type { User } from "@bchat/types"
import { createContext } from "react"

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    setUser: (user: User) => void
    logout: () => Promise<void>
    refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
