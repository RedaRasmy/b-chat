import { Button } from "@/components/ui/button"
import ChatButton from "@/features/chats/components/chat-button"
import FriendCard from "@/features/friendships/components/friend-card"
import UnfriendButton from "@/features/friendships/components/unfriend-button"
import { fetchFriends } from "@/features/friendships/requests"
import LoadingPage from "@/pages/loading"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

export default function Friends() {
    const { data, isLoading } = useQuery({
        queryKey: ["friends"],
        queryFn: fetchFriends,
    })

    if (isLoading || !data) return <LoadingPage className="h-full" />
    if (data.length === 0)
        return (
            <div className="text-center flex items-center flex-col gap-2 h-full justify-center font-semibold text-xl">
                <h1 className="max-w-50 lg:max-w-100">
                    You don't have any friends yet
                </h1>
                <Link to={"/users"}>
                    <Button>Add new friend</Button>
                </Link>
            </div>
        )

    return (
        <div
            className={
                "flex-1 flex flex-col px-0.5 py-0.5 lg:px-2 items-center"
            }
        >
            <div
                className="max-w-200 w-full flex flex-col gap-2 lg:gap-3"
                aria-label="friends"
            >
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
