import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/features/auth/use-auth"
import { fetchReceivedRequests } from "@/features/friendships/requests"
import Friends from "@/features/profile/components/friends"
import MyPosts from "@/features/profile/components/my-posts"
import Requests from "@/features/profile/components/requests"
import Settings from "@/features/profile/components/settings"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

export default function ProfilePage() {
    const [params, setParams] = useSearchParams()
    const { logout } = useAuth()
    const tab = params.get("tab") ?? "friends"

    const { data: requests = [] } = useQuery({
        queryKey: ["requests"],
        queryFn: fetchReceivedRequests,
    })
    const requestCount = requests.length

    const { t } = useTranslation(["profile", "auth"])

    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr]">
            <PageHeader>
                <h1> {t("profile:pageTitle")}</h1>
                <Button onClick={logout} variant={"destructive"}>
                    {t("auth:buttons.logout")}
                </Button>
            </PageHeader>
            <main className="p-3 space-y-2 overflow-y-auto">
                <Tabs
                    value={tab}
                    onValueChange={(tab) =>
                        setParams({
                            tab,
                        })
                    }
                    className={"h-full grid grid-rows-[auto_1fr]"}
                >
                    <TabsList className={"w-full mb-2"}>
                        <TabsTrigger value="friends">
                            {" "}
                            {t("profile:tabs.friends")}
                        </TabsTrigger>
                        <TabsTrigger value="posts">
                            {" "}
                            {t("profile:tabs.myPosts")}
                        </TabsTrigger>
                        <TabsTrigger value="requests">
                            {t("profile:tabs.requests")}
                            {requestCount > 0 && (
                                <span className="border bg-destructive text-white font-mono text-xs size-4 rounded-full flex items-center justify-center">
                                    {requestCount}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            {t("profile:tabs.settings")}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="friends" className={"overflow-y-auto"}>
                        <Friends />
                    </TabsContent>
                    <TabsContent value="posts" className={"overflow-y-auto"}>
                        <MyPosts />
                    </TabsContent>
                    <TabsContent value="requests" className={"overflow-y-auto"}>
                        <Requests />
                    </TabsContent>
                    <TabsContent value="settings" className={"overflow-y-auto"}>
                        <Settings />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
