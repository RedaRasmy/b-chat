import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/features/auth/use-auth"
import Friends from "@/features/profile/components/friends"
import Requests from "@/features/profile/components/requests"
import Settings from "@/features/profile/components/settings"
import { useSearchParams } from "react-router-dom"

export default function ProfilePage() {
    const [params, setParams] = useSearchParams()
    const { logout } = useAuth()
    const tab = params.get("tab") ?? "friends"

    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr]">
            <PageHeader>
                <h1>Profile</h1>
                <Button onClick={logout}>Log out</Button>
            </PageHeader>
            <main className="p-3 space-y-2 overflow-y-auto">
                <Tabs
                    defaultValue={tab}
                    onValueChange={(tab) =>
                        setParams({
                            tab,
                        })
                    }
                    className={"h-full"}
                >
                    <TabsList className={"w-full mb-2"}>
                        <TabsTrigger value="friends">Friends</TabsTrigger>
                        <TabsTrigger value="posts">My Posts</TabsTrigger>
                        <TabsTrigger value="requests">Requests</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="friends">
                        <Friends />
                    </TabsContent>
                    <TabsContent value="requests">
                        <Requests />
                    </TabsContent>
                    <TabsContent value="settings">
                        <Settings />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
