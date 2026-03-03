import UserCard from "@/components/user-card"
import AcceptButton from "@/features/friendships/components/accept-button"
import RejectButton from "@/features/friendships/components/reject-button"
import { fetchReceivedRequests } from "@/features/friendships/requests"
import LoadingPage from "@/pages/loading"
import { useQuery } from "@tanstack/react-query"

export default function Requests() {
    const { data, isLoading } = useQuery({
        queryKey: ["requests"],
        queryFn: fetchReceivedRequests,
    })

    if (isLoading || !data) return <LoadingPage className="h-full" />
    if (data?.length === 0)
        return (
            <div className="text-center flex items-center h-full justify-center font-semibold text-xl">
                <h1 className="max-w-50 lg:max-w-100">
                    You don't have any pending requests
                </h1>
            </div>
        )

    return (
        <div className={"flex-1 flex flex-col p-3 xl:p-5 items-center h-full"}>
            <div className="max-w-200 w-full flex flex-col gap-4">
                {data.map((request) => (
                    <UserCard user={request.requester} key={request.id}>
                        <RejectButton friendshipId={request.id} />
                        <AcceptButton friendshipId={request.id} />
                    </UserCard>
                ))}
            </div>
        </div>
    )
}
