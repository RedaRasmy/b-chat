import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import {
    Files01Icon,
    User02Icon,
    UserMultiple03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "react-router-dom"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <Link
                    to={"/"}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-primary"
                >
                    <HugeiconsIcon icon={User02Icon} />
                    <span>Profile</span>
                </Link>
                <Link
                    to={"/posts"}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-primary"
                >
                    <HugeiconsIcon icon={Files01Icon} />
                    <span>Posts</span>
                </Link>
                <Link
                    to={"/users"}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-primary"
                >
                    <HugeiconsIcon icon={UserMultiple03Icon} />
                    <span>Users</span>
                </Link>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <SidebarGroupContent></SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    )
}
