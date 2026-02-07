import { Button } from "@/components/ui/button"
import UserCard from "@/components/user-card"
import { getFriends, unfriend } from "@/features/friendships/requests"
import { Message01Icon, UserMinus01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function Friends() {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["friends"],
        queryFn: getFriends,
    })

    const unfriendMutation = useMutation({
        mutationFn: unfriend,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friends"],
            })
        },
    })

    if (isLoading || !data) return null
    if (data?.length === 0)
        return (
            <div className="text-center flex items-center h-full justify-center font-semibold text-xl">
                <h1 className="max-w-50 lg:max-w-100">
                    You don't have any friends yet
                </h1>
            </div>
        )

    return (
        <div className={"flex-1 flex flex-col p-3 xl:p-5 items-center"}>
            <div className="max-w-200 w-full flex flex-col gap-4">
                {data.map((fs) => (
                    <UserCard user={fs.friend} key={fs.id}>
                        <Button
                            disabled={unfriendMutation.isPending}
                            onClick={() => {
                                unfriendMutation.mutate(fs.id)
                            }}
                            variant={"destructive"}
                        >
                            <HugeiconsIcon icon={UserMinus01Icon} />
                            unfriend
                        </Button>
                        <Button disabled={false} onClick={() => {}}>
                            <HugeiconsIcon icon={Message01Icon} />
                            chat
                        </Button>
                    </UserCard>
                ))}
            </div>
        </div>
    )
}
