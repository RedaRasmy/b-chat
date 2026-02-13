import type { Profile } from "@bchat/types"
import { createContext } from "react"

interface AuthContextType {
    user: Profile | null
    isAuthenticated: boolean
    isLoading: boolean
    setUser: (user: Profile) => void
    logout: () => Promise<void>
    refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const UserContext = createContext<Profile | null>(null)
