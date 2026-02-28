import PageHeader from "@/components/page-header"
import { Input } from "@/components/ui/input"
import UserCard from "@/components/user-card"
import ChatButton from "@/features/chats/components/chat-button"
import AcceptButton from "@/features/friendships/components/accept-button"
import CancelButton from "@/features/friendships/components/cancel-button"
import RejectButton from "@/features/friendships/components/reject-button"
import RequestButton from "@/features/friendships/components/request-button"
import UnfriendButton from "@/features/friendships/components/unfriend-button"
import {
    fetchFriends,
    fetchReceivedRequests,
    fetchSentRequests,
    fetchUsers,
} from "@/features/friendships/requests"
import { cn } from "@/lib/utils"
import LoadingPage from "@/pages/loading"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"

export default function UsersPage() {
    const [name, setName] = useState("")
    const { data, isPlaceholderData } = useQuery({
        queryKey: ["users", name],
        queryFn: () => {
            return fetchUsers(name || undefined)
        },
        placeholderData: keepPreviousData,
    })

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

    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr]">
            <PageHeader>
                <h1>Users</h1>
                <p className="text-muted-foreground text-sm">
                    Find new friends here!
                </p>
            </PageHeader>
            <main
                className={cn(
                    "p-3 grid grid-rows-[auto_1fr]",
                    "max-w-200 mx-auto w-full space-y-3",
                )}
            >
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="py-5 px-5 rounded-2xl"
                    placeholder="Find users by name"
                />
                <section
                    className={cn("p-1 space-y-2 overflow-y-auto", {
                        "opacity-50": isPlaceholderData,
                    })}
                >
                    {data ? (
                        data.map((user) => {
                            const friend = friends.find((f) => f.id === user.id)
                            const sentReq = sentRequests.find(
                                (req) => req.receiverId === user.id,
                            )
                            const req = receivedRequests.find(
                                (req) => req.requesterId === user.id,
                            )
                            if (friend)
                                return (
                                    <UserCard key={user.id} user={user}>
                                        <UnfriendButton
                                            friendshipId={friend.friendshipId}
                                        />
                                        <ChatButton friendId={user.id} />
                                    </UserCard>
                                )
                            if (sentReq) {
                                return (
                                    <UserCard key={user.id} user={user}>
                                        <CancelButton
                                            friendshipId={sentReq.id}
                                        />
                                    </UserCard>
                                )
                            }

                            if (req) {
                                return (
                                    <UserCard key={user.id} user={user}>
                                        <RejectButton friendshipId={req.id} />
                                        <AcceptButton friendshipId={req.id} />
                                    </UserCard>
                                )
                            }
                            return (
                                <UserCard key={user.id} user={user}>
                                    <RequestButton userId={user.id} />
                                </UserCard>
                            )
                        })
                    ) : (
                        <LoadingPage className="h-full" />
                    )}
                </section>
            </main>
        </div>
    )
}
