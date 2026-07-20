import { UserContext } from "@/features/auth/context"
import { useAuth } from "@/features/auth/use-auth"
import LoadingPage from "@/pages/loading"
import { Navigate } from "react-router-dom"

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <LoadingPage />
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />
    }

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
