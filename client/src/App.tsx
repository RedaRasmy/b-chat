import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { useAuth } from "@/features/auth/use-auth"
import SocketProvider from "@/features/chats/components/socket-provider"
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
            <SocketProvider>
                <Toaster position="top-right" closeButton theme="light" />
                <AppSidebar />
                <Outlet />
            </SocketProvider>
        </SidebarProvider>
    )
}

export default App
