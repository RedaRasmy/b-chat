import ChatButton from "@/features/chats/components/chat-button"
import FriendCard from "@/features/friendships/components/friend-card"
import UnfriendButton from "@/features/friendships/components/unfriend-button"
import { fetchFriends } from "@/features/friendships/requests"
import { useQuery } from "@tanstack/react-query"

export default function Friends() {
    const { data, isLoading } = useQuery({
        queryKey: ["friends"],
        queryFn: fetchFriends,
    })

    if (isLoading || !data) return null
    if (data?.length === 0)
        return (
            <div className="text-center flex items-center h-full justify-center font-semibold text-xl">
                <h1 className="max-w-50 lg:max-w-100">
                    You don't have any friends yet
                </h1>
            </div>
        )

    return (
        <div className={"flex-1 flex flex-col p-3 xl:p-5 items-center"}>
            <div className="max-w-200 w-full flex flex-col gap-4">
                {data.map((friend) => (
                    <FriendCard friend={friend} key={friend.id}>
                        <UnfriendButton friendshipId={friend.friendshipId} />
                        <ChatButton friendId={friend.id} />
                    </FriendCard>
                ))}
            </div>
        </div>
    )
}
