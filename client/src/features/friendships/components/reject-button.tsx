import { Button } from "@/components/ui/button"
import { rejectFriendship } from "@/features/friendships/requests"
import { UserRemove01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function RejectButton({
    friendshipId,
    className
}: {
    friendshipId: string
    className?: string
}) {
    const queryClient = useQueryClient()
    const rejectMutation = useMutation({
        mutationFn: rejectFriendship,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["requests"],
            })
        },
    })
    return (
        <Button
            disabled={rejectMutation.isPending}
            onClick={() => {
                rejectMutation.mutate(friendshipId)
            }}
            variant={"destructive"}
            className={className}
        >
            <HugeiconsIcon icon={UserRemove01Icon} />
            reject
        </Button>
    )
}
