import { SidebarTrigger } from "@/components/ui/sidebar"
import Post from "@/features/posts/components/Post"
import { PostForm } from "@/features/posts/components/post-form"
import { addPost, getPosts } from "@/features/posts/requests"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function PostsPage() {
    const queryClient = useQueryClient()
    const { data } = useQuery({
        queryKey: ["posts"],
        queryFn: () =>
            getPosts({
                page: 1,
                perPage: 20,
            }),
    })

    const addMutation = useMutation({
        mutationFn: addPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            })
        },
    })
    if (!data) return null
    return (
        <div className="w-full h-screen flex flex-col ">
            <header className="bg-accent h-12 shrink-0 flex items-center px-3 gap-3 border-b">
                <SidebarTrigger size={"lg"} />
                <div className="flex justify-between w-full">
                    <h1>Posts</h1>
                    <PostForm
                        title="Add New Post"
                        onSubmit={addMutation.mutateAsync}
                        isSubmitting={addMutation.isPending}
                        triggerText="New Post"
                    />
                </div>
            </header>
            <main className="flex-1 p-3 flex flex-col items-center gap-2">
                {data.data.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </main>
        </div>
    )
}
