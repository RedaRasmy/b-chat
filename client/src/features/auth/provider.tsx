import { useState, useEffect, type ReactNode, useCallback } from "react"
import type { User } from "@bchat/shared/types"
import { fetchMe, logoutRequest } from "./requests"
import { AuthContext } from "./context"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const set = useCallback((user: User) => {
        setUser(user)
        setLoading(false)
    }, [])

    const logout = useCallback(async () => {
        try {
            await logoutRequest()
        } catch (err) {
            console.error("Logout failed", err)
        } finally {
            setUser(null)
        }
    }, [])

    const fetchUser = useCallback(async () => {
        try {
            const user = await fetchMe()
            setUser(user)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading: loading,
                logout,
                refresh: fetchUser,
                setUser: set,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
