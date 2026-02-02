import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/use-auth"
import LoadingPage from "@/pages/loading"
import { Navigate, Outlet } from "react-router-dom"

export function App() {
    const { isAuthenticated, isLoading } = useAuth()
    if (isLoading) return <LoadingPage />

    if (!isAuthenticated) {
        return <Navigate to={"/auth/login"} replace />
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <Outlet />
        </SidebarProvider>
    )
}

export default App
