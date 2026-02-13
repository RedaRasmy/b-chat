import { ActionButton } from "@/components/action-button"
import { deleteChat } from "@/features/chats/requests"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ReactElement } from "react"
import { useNavigate } from "react-router-dom"

export function DeleteChat({
    chatId,
    children,
}: {
    chatId: string
    children: ReactElement
}) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const deleteMutation = useMutation({
        mutationFn: deleteChat,
        onSuccess: () => {
            navigate("/")
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        },
    })

    return (
        <ActionButton
            action={() => deleteMutation.mutate(chatId)}
            requireAreYouSure
            triggerElement={children}
        />
    )
}
