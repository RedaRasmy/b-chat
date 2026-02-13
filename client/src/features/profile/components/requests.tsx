import { Button } from "@/components/ui/button"
import UserCard from "@/components/user-card"
import {
    acceptFriendship,
    fetchReceivedRequests,
    rejectFriendship,
} from "@/features/friendships/requests"
import { UserCheck01Icon, UserRemove01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function Requests() {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["requests"],
        queryFn: fetchReceivedRequests,
    })

    const acceptMutation = useMutation({
        mutationFn: acceptFriendship,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["requests"],
            })
            queryClient.invalidateQueries({
                queryKey: ["friends"],
            })
        },
    })

    const rejectMutation = useMutation({
        mutationFn: rejectFriendship,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["requests"],
            })
        },
    })

    if (isLoading || !data) return null
    if (data?.length === 0)
        return (
            <div className="text-center flex items-center h-full justify-center font-semibold text-xl">
                <h1 className="max-w-50 lg:max-w-100">
                    You don't have any pending requests
                </h1>
            </div>
        )

    return (
        <div className={"flex-1 flex flex-col p-3 xl:p-5 items-center h-full"}>
            <div className="max-w-200 w-full flex flex-col gap-4">
                {data.map((request) => (
                    <UserCard user={request.requester} key={request.id}>
                        <Button
                            disabled={rejectMutation.isPending}
                            onClick={() => {
                                rejectMutation.mutate(request.id)
                            }}
                            variant={"destructive"}
                        >
                            <HugeiconsIcon icon={UserRemove01Icon} />
                            reject
                        </Button>
                        <Button
                            title="send friend request"
                            disabled={acceptMutation.isPending}
                            onClick={() => {
                                acceptMutation.mutate(request.id)
                            }}
                        >
                            <HugeiconsIcon icon={UserCheck01Icon} />
                            accept
                        </Button>
                    </UserCard>
                ))}
            </div>
        </div>
    )
}
