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
import DMCard from "@/features/chats/dm/components/dm-card"
import GroupCard from "@/features/chats/groups/components/group-card"
import { GroupFormDialog } from "@/features/chats/groups/components/group-form"
import { fetchChats } from "@/features/chats/requests"
import { fetchReceivedRequests } from "@/features/friendships/requests"
import {
    Files01Icon,
    User02Icon,
    UserMultiple03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

export function AppSidebar() {
    const { data = [] } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
    })

    const { data: requests = [] } = useQuery({
        queryKey: ["requests"],
        queryFn: fetchReceivedRequests,
    })
    const requestCount = requests.length

    return (
        <Sidebar>
            <SidebarHeader className="">
                <Link
                    to={requestCount ? "/?tab=requests" : "/"}
                    className="flex relative items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
                >
                    <HugeiconsIcon icon={User02Icon} />
                    <span>Profile</span>
                    {requestCount > 0 && (
                        <div className="size-4 bg-destructive text-white rounded-full font-mono flex items-center justify-center text-sm">
                            {requestCount}
                        </div>
                    )}
                </Link>
                <Link
                    to={"/posts"}
                    className="flex relative items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
                >
                    <HugeiconsIcon icon={Files01Icon} />
                    <span>Posts</span>
                </Link>
                <Link
                    to={"/users"}
                    className="flex relative items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
                >
                    <HugeiconsIcon icon={UserMultiple03Icon} />
                    <span>Users</span>
                </Link>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup className="space-y-1">
                    <SidebarGroupLabel className="flex justify-between items-center">
                        <h1>Chats</h1>
                        <GroupFormDialog />
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="grid gap-1 overflow-auto p-2 -mt-2">
                        {data.map((chat) =>
                            chat.type === "dm" ? (
                                <DMCard key={chat.id} chat={chat} />
                            ) : (
                                <GroupCard key={chat.id} chat={chat} />
                            ),
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    )
}
