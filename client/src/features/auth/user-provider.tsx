import { UserContext } from "@/features/auth/context"
import { useAuth } from "@/features/auth/use-auth"
import LoadingPage from "@/pages/loading"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/auth/login")
        }
    }, [user, isLoading, navigate])

    if (isLoading) {
        return <LoadingPage />
    }

    if (!user) {
        navigate("/auth/login")
    }

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
