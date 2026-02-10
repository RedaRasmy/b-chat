import { ActionButton } from "@/components/action-button"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/use-auth"
import Post from "@/features/posts/components/post"
import { PostForm } from "@/features/posts/components/post-form"
import { deletePost, updatePost } from "@/features/posts/requests"
import { fetchMyPosts } from "@/features/profile/requests"
import { Delete03Icon, Edit04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
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
        mutationFn: deletePost,
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
        <div className={"p-1 grid justify-items-center w-full space-y-3"}>
            {data.map((post) => (
                <Post
                    key={post.id}
                    post={{
                        ...post,
                        author: {
                            id: user.id,
                            name: user.name,
                            role: user.role,
                            avatar: user.avatar,
                        },
                    }}
                >
                    <PostForm
                        key={post.id + post.content}
                        isSubmitting={updateMutation.isPending}
                        onSubmit={(data) =>
                            updateMutation.mutateAsync({
                                id: post.id,
                                data,
                            })
                        }
                        initialData={post}
                        title="Update Your Post"
                        triggerElement={
                            <Button size={"icon-sm"}>
                                <HugeiconsIcon icon={Edit04Icon} />
                            </Button>
                        }
                    />

                    <ActionButton
                        action={() => deleteMutation.mutateAsync(post.id)}
                        requireAreYouSure
                        triggerElement={
                            <Button variant="destructive" size={"icon-sm"}>
                                <HugeiconsIcon icon={Delete03Icon} />
                            </Button>
                        }
                    />
                </Post>
            ))}
        </div>
    )
}
