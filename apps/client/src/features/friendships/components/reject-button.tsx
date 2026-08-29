import { Button } from "@/components/ui/button"
import { rejectFriendship } from "@/features/friendships/requests"
import { UserRemove01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function RejectButton({
    friendshipId,
    className,
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
    const { t } = useTranslation("friends")
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
            {t("buttons.reject")}
        </Button>
    )
}
