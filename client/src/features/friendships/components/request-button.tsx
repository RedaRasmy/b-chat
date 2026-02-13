import { Button } from "@/components/ui/button"
import { requestFriendship } from "@/features/friendships/requests"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function RequestButton({ userId }: { userId: string }) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: requestFriendship,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["sent-requests"],
            })
        },
    })
    return (
        <Button
            title="send friend request"
            disabled={mutation.isPending}
            onClick={() => {
                mutation.mutate(userId)
            }}
        >
            <HugeiconsIcon icon={UserAdd01Icon} />
            add friend
        </Button>
    )
}
