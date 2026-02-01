import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export function App() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <Outlet />
        </SidebarProvider>
    )
}

export default App
