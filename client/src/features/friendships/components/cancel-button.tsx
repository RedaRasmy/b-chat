import { Button } from "@/components/ui/button"
import { cancelRequest } from "@/features/friendships/requests"
import { UserTime01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function CancelButton({
    friendshipId,
    className,
}: {
    friendshipId: string
    className?: string
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
    const { t } = useTranslation("friends")
    return (
        <Button
            disabled={mutation.isPending}
            onClick={() => {
                mutation.mutate(friendshipId)
            }}
            variant={"outline"}
            className={className}
        >
            <HugeiconsIcon icon={UserTime01Icon} />
            {t("buttons.cancelRequest")}
        </Button>
    )
}
