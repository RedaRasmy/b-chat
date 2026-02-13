import { Button } from "@/components/ui/button"
import { cancelRequest } from "@/features/friendships/requests"
import { UserTime01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function CancelButton({
    friendshipId,
}: {
    friendshipId: string
}) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: cancelRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["sent-requests"],
            })
        },
    })
    return (
        <Button
            disabled={mutation.isPending}
            onClick={() => {
                mutation.mutate(friendshipId)
            }}
            variant={"outline"}
        >
            <HugeiconsIcon icon={UserTime01Icon} />
            pending
        </Button>
    )
}
