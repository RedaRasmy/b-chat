import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import UserCard from "@/components/user-card"
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
            return getUsers(name || undefined)
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
                <div
                    className={cn(
                        "max-w-200 mx-auto w-full flex flex-col gap-4",
                        {
                            "opacity-50": isPlaceholderData,
                        },
                    )}
                >
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="py-5 px-5 rounded-2xl"
                        placeholder="Find users by name"
                    />
                    {data ? (
                        data.map((user) => (
                            <UserCard key={user.id} user={user}>
                                <Button
                                    title="send friend request"
                                    disabled={mutation.isPending}
                                    onClick={() => {
                                        mutation.mutate(user.id)
                                    }}
                                >
                                    <HugeiconsIcon icon={UserAdd01Icon} />
                                </Button>
                            </UserCard>
                        ))
                    ) : (
                        <LoadingPage />
                    )}
                </div>
            </main>
        </div>
    )
}
