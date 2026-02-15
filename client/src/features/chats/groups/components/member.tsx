import { ActionButton } from "@/components/action-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import UserCard from "@/components/user-card"
import RoleToggle from "@/features/chats/groups/components/role-toggle"
import { useGroup } from "@/features/chats/groups/use-group"
import { useChat } from "@/features/chats/hooks/use-chat"
import { deleteMember } from "@/features/chats/requests"
import type { ChatMember } from "@bchat/types"
import {
    Delete02Icon,
    MoreVerticalSquare01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/features/auth/use-user"
import { getTime } from "@/features/chats/utils/get-time"
import {
    fetchFriends,
    fetchReceivedRequests,
    fetchSentRequests,
} from "@/features/friendships/requests"
import UnfriendButton from "@/features/friendships/components/unfriend-button"
import ChatButton from "@/features/chats/components/chat-button"
import CancelButton from "@/features/friendships/components/cancel-button"
import RejectButton from "@/features/friendships/components/reject-button"
import AcceptButton from "@/features/friendships/components/accept-button"
import RequestButton from "@/features/friendships/components/request-button"

export default function Member({ member }: { member: ChatMember }) {
    const { isOwner, isAdmin, isMember } = useGroup()
    const { id } = useUser()
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

    const isUser = member.id === id

    const { data: friends = [] } = useQuery({
        queryKey: ["friends"],
        queryFn: fetchFriends,
    })

    const { data: sentRequests = [] } = useQuery({
        queryKey: ["sent-requests"],
        queryFn: fetchSentRequests,
    })

    const { data: receivedRequests = [] } = useQuery({
        queryKey: ["requests"],
        queryFn: fetchReceivedRequests,
    })

    const friend = friends.find((f) => f.id === member.id)
    const sentReq = sentRequests.find((req) => req.receiverId === member.id)
    const req = receivedRequests.find((req) => req.requesterId === member.id)

    const isNew = !friend && !sentReq && !req

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
                            <Button variant={"destructive"} size={"icon"}>
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
            {!isUser && (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="outline" size={"icon"}>
                                <HugeiconsIcon
                                    icon={MoreVerticalSquare01Icon}
                                />
                            </Button>
                        }
                    ></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
                            {friend && (
                                <div className="grid gap-0.5">
                                    <DropdownMenuItem
                                        render={
                                            <ChatButton
                                                friendId={member.id}
                                                className="w-full"
                                            />
                                        }
                                    ></DropdownMenuItem>
                                    <DropdownMenuItem
                                        variant="destructive"
                                        render={
                                            <UnfriendButton
                                                friendshipId={
                                                    friend.friendshipId
                                                }
                                                className="w-full"
                                            />
                                        }
                                    ></DropdownMenuItem>
                                </div>
                            )}

                            {sentReq && (
                                <DropdownMenuItem
                                    render={
                                        <CancelButton
                                            friendshipId={sentReq.id}
                                            className="w-full"
                                        />
                                    }
                                />
                            )}
                            {req && (
                                <div className="grid gap-0.5">
                                    <DropdownMenuItem
                                        render={
                                            <AcceptButton
                                                friendshipId={req.id}
                                                className="w-full"
                                            />
                                        }
                                    />
                                    <DropdownMenuItem
                                        render={
                                            <RejectButton
                                                friendshipId={req.id}
                                                className="w-full"
                                            />
                                        }
                                    />
                                </div>
                            )}

                            {isNew && (
                                <DropdownMenuItem
                                    render={
                                        <RequestButton
                                            className={"w-full"}
                                            userId={member.id}
                                        />
                                    }
                                />
                            )}
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>
                                joined {getTime(member.joinedAt)}
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </UserCard>
    )
}
