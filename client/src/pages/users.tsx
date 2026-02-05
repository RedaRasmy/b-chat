import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getUsers, requestFriendship } from "@/features/friendships/requests"
import { cn } from "@/lib/utils"
import LoadingPage from "@/pages/loading"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"

export default function UsersPage() {
    const [name, setName] = useState("")
    const { data, isPlaceholderData } = useQuery({
        queryKey: ["users", name],
        queryFn: () => {
            return getUsers(name === "" ? undefined : name)
        },
        placeholderData: keepPreviousData,
    })

    const mutation = useMutation({
        mutationFn: requestFriendship,
    })

    return (
        <div className="w-full h-screen flex flex-col ">
            <header className="bg-accent h-12 flex items-center px-3 gap-3 border-b">
                <SidebarTrigger size={"lg"} />
                <div className="flex justify-between w-full items-center">
                    <h1>Users</h1>
                    <p className="text-muted-foreground text-sm">
                        Find new friends here!
                    </p>
                </div>
            </header>
            <main className="flex-1 flex flex-col p-3 xl:p-5 items-center">
                <div className="max-w-200 mx-auto w-full flex flex-col gap-4">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="py-5 px-5 rounded-2xl"
                        placeholder="Find users by name"
                    />
                    {data ? (
                        data.map((user) => (
                            <Card
                                key={user.id}
                                className={cn({
                                    "opacity-50": isPlaceholderData,
                                })}
                            >
                                <CardContent className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-primary text-xl text-foreground/70 uppercase flex items-center justify-center">
                                            {user.name.charAt(0)}
                                        </div>
                                        <h1 className="text-lg ">
                                            {user.name}
                                        </h1>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            title="send friend request"
                                            disabled={mutation.isPending}
                                            onClick={() => {
                                                mutation.mutate(user.id)
                                            }}
                                        >
                                            <HugeiconsIcon
                                                icon={UserAdd01Icon}
                                            />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <LoadingPage />
                    )}
                </div>
            </main>
        </div>
    )
}
