import { ActionButton } from "@/components/action-button"
import { Button } from "@/components/ui/button"
import { unfriend } from "@/features/friendships/requests"
import { UserMinus01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function UnfriendButton({
    friendshipId,
    className,
}: {
    friendshipId: string
    className?: string
}) {
    const queryClient = useQueryClient()
    const unfriendMutation = useMutation({
        mutationFn: unfriend,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friends"],
            })
        },
    })
    const { t } = useTranslation("friends")
    return (
        <ActionButton
            action={() => {
                unfriendMutation.mutate(friendshipId)
            }}
            requireAreYouSure
            triggerElement={
                <Button
                    disabled={unfriendMutation.isPending}
                    variant={"destructive"}
                    className={className}
                >
                    <HugeiconsIcon icon={UserMinus01Icon} />
                    {t("buttons.unfriend")}
                </Button>
            }
        />
    )
}
