import { ActionButton } from "@/components/action-button"
import { Button } from "@/components/ui/button"
import { updateMember } from "@/features/chats/requests"
import type { ChatMember } from "@bchat/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function RoleToggle({
    member,
    channelId,
}: {
    member: ChatMember
    channelId: string
}) {
    if (member.chatRole === "owner") {
        throw new Error("Can't toggle owner role")
    }
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: updateMember,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        },
    })

    const role = member.chatRole
    const newRole = member.chatRole === "admin" ? "member" : "admin"

    return (
        <ActionButton
            action={() =>
                mutation.mutate({
                    channelId,
                    userId: member.id,
                    role: newRole,
                })
            }
            requireAreYouSure
            areYouSureDescription={`Change ${member.name} role to : ${newRole}`}
            triggerElement={
                <Button variant={role === "member" ? "outline" : "default"}>
                    {member.chatRole}
                </Button>
            }
        ></ActionButton>
    )
}
