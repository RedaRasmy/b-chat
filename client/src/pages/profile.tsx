import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/features/auth/use-auth"
import Settings from "@/features/profile/components/settings"
import { useSearchParams } from "react-router-dom"

export default function ProfilePage() {
    const [params, setParams] = useSearchParams()
    const { logout } = useAuth()
    const tab = params.get("tab") ?? "friends"

    return (
        <div className="w-full h-screen flex flex-col ">
            <header className="bg-accent h-12 flex items-center px-3 gap-3">
                <SidebarTrigger size={"lg"} />
                <div className="flex justify-between w-full">
                    <h1>Profile</h1>
                    <Button onClick={logout}>Log out</Button>
                </div>
            </header>
            <main className="h-full p-2">
                <Tabs
                    defaultValue={tab}
                    onValueChange={(tab) =>
                        setParams({
                            tab,
                        })
                    }
                >
                    <TabsList className={"w-full mb-2"}>
                        <TabsTrigger value="friends">Friends</TabsTrigger>
                        <TabsTrigger value="my-posts">My Posts</TabsTrigger>
                        <TabsTrigger value="requests">Requests</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <Settings />
                </Tabs>
            </main>
        </div>
    )
}
