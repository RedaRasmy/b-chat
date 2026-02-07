import { useAuth } from "@/features/auth/use-auth"
import Post from "@/features/posts/components/post"
import { updatePost } from "@/features/posts/requests"
import { fetchMyPosts } from "@/features/profile/requests"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function MyPosts() {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["posts", "me"],
        queryFn: fetchMyPosts,
    })

    const updateMutation = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            })
        },
    })

    if (isLoading || !data || !user) return null
    if (data?.length === 0)
        return (
            <div className="text-center flex items-center h-full justify-center font-semibold text-xl">
                <h1 className="max-w-50 lg:max-w-100">
                    You don't have any posts yet
                </h1>
            </div>
        )

    return (
        <div className={"p-3 xl:p-5 max-w-200 mx-auto w-full space-y-3"}>
            {data.map((post) => (
                <Post
                    key={post.id}
                    post={{
                        ...post,
                        author: {
                            name: user.name,
                            role: user.role,
                            avatar: user.avatar,
                        },
                    }}
                />
            ))}
        </div>
    )
}
