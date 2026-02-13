import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "@/features/auth/user-provider"
import SocketProvider from "@/features/chats/components/socket-provider"
import { Outlet } from "react-router-dom"

export function App() {
    return (
        <UserProvider>
            <SidebarProvider>
                <SocketProvider>
                    <Toaster position="top-right" closeButton theme="light" />
                    <AppSidebar />
                    <Outlet />
                </SocketProvider>
            </SidebarProvider>
        </UserProvider>
    )
}

export default App
