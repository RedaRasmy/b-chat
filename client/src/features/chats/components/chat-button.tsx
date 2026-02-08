import { Button } from "@/components/ui/button"
import { createDM, fetchChats } from "@/features/chats/requests"
import { Message01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

export default function ChatButton({ friendId }: { friendId: string }) {
    const navigate = useNavigate()
    const { data, isLoading } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
    })

    const mutation = useMutation({
        mutationFn: createDM,
        onSuccess: (data) => {
            navigate("chats/" + data.channelId)
        },
        onError: (error) => {
            console.error(error.message)
        },
    })

    function handleClick() {
        if (!data) return
        const existing = data.dms.find((c) => c.friend.id === friendId)
        if (existing) {
            navigate("chats/" + existing.id)
        } else {
            mutation.mutate({
                friendId,
            })
        }
    }

    return (
        <Button
            disabled={isLoading || mutation.isPending || !data}
            onClick={handleClick}
        >
            <HugeiconsIcon icon={Message01Icon} />
            chat
        </Button>
    )
}
