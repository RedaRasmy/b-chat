import { ActionButton } from "@/components/action-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import UserCard from "@/components/user-card"
import RoleToggle from "@/features/chats/groups/components/role-toggle"
import { useGroup } from "@/features/chats/groups/use-group"
import { useChat } from "@/features/chats/hooks/use-chat"
import { deleteMember } from "@/features/chats/requests"
import type { ChatMember } from "@bchat/types"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function Member({ member }: { member: ChatMember }) {
    const { isOwner, isAdmin, isMember } = useGroup()
    const { chat } = useChat()
    const queryClient = useQueryClient()

    const banMutation = useMutation({
        mutationFn: deleteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        },
    })

    return (
        <UserCard
            key={member.id}
            user={{
                id: member.id,
                avatar: member.avatar,
                name: member.name,
                role: member.role,
            }}
        >
            {isOwner && member.chatRole !== "owner" && (
                <RoleToggle member={member} channelId={chat.id} />
            )}
            {(isAdmin || isOwner) &&
                member.chatRole !== "owner" &&
                (!isAdmin || member.chatRole !== "admin") && (
                    <ActionButton
                        action={() =>
                            banMutation.mutate({
                                channelId: chat.id,
                                userId: member.id,
                            })
                        }
                        requireAreYouSure
                        areYouSureDescription={`Delete member : ${member.name}`}
                        triggerElement={
                            <Button variant={"destructive"}>
                                <HugeiconsIcon icon={Delete02Icon} />
                            </Button>
                        }
                    ></ActionButton>
                )}
            {(isMember || isAdmin) && member.chatRole !== "member" && (
                <Badge
                    variant={
                        member.chatRole === "owner" ? "destructive" : "default"
                    }
                >
                    {member.chatRole}
                </Badge>
            )}
        </UserCard>
    )
}
