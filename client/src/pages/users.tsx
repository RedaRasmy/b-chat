import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
        <div className="w-full h-screen grid grid-rows-[auto_1fr]">
            <PageHeader>
                <h1>Users</h1>
                <p className="text-muted-foreground text-sm">
                    Find new friends here!
                </p>
            </PageHeader>
            <main
                className={cn(
                    "p-3 space-y-2 overflow-y-auto",
                    "max-w-200 mx-auto w-full space-y-3",
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
            </main>
        </div>
    )
}
