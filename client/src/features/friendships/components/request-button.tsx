import { Button } from "@/components/ui/button"
import { requestFriendship } from "@/features/friendships/requests"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function RequestButton({
    userId,
    className,
}: {
    userId: string
    className?: string
}) {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: requestFriendship,
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
                mutation.mutate(userId)
            }}
            className={className}
        >
            <HugeiconsIcon icon={UserAdd01Icon} />
            {t("buttons.addFriend")}
        </Button>
    )
}
