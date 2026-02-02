import { useAuth } from "@/features/auth/use-auth"
import LoadingPage from "@/pages/loading"
import { Navigate, Outlet } from "react-router-dom"

export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) return <LoadingPage />

    if (isAuthenticated) {
        return <Navigate to={"/"} replace />
    }

    return <Outlet />
}
