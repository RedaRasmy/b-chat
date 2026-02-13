import { Button } from "@/components/ui/button"
import { acceptFriendship } from "@/features/friendships/requests"
import { UserCheck01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function AcceptButton({
    friendshipId,
}: {
    friendshipId: string
}) {
    const queryClient = useQueryClient()
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
    return (
        <Button
            disabled={acceptMutation.isPending}
            onClick={() => {
                acceptMutation.mutate(friendshipId)
            }}
        >
            <HugeiconsIcon icon={UserCheck01Icon} />
            accept
        </Button>
    )
}
