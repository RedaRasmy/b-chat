import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "@/features/auth/user-provider"
import GlobalListeners from "@/features/chats/components/global-listeners"
import SocketProvider from "@/features/chats/components/socket-provider"
import LoadingPage from "@/pages/loading"
import { Suspense } from "react"
import { Outlet } from "react-router-dom"

export function App() {
    return (
        <UserProvider>
            <SidebarProvider>
                <SocketProvider>
                    <GlobalListeners />
                    <Toaster position="top-right" closeButton theme="light" />
                    <AppSidebar />
                    <Suspense fallback={<LoadingPage />}>
                        <Outlet />
                    </Suspense>
                </SocketProvider>
            </SidebarProvider>
        </UserProvider>
    )
}

export default App
