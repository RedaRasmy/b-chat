import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import Post from "@/features/posts/components/post"
import { PostForm } from "@/features/posts/components/post-form"
import { addPost, getPosts } from "@/features/posts/requests"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function PostsPage() {
    const [open, setOpen] = useState(false)
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
            setOpen(false)
        },
    })
    if (!data) return null
    return (
        <div className="w-full h-screen grid">
            <PageHeader>
                <h1>Posts</h1>
                <PostForm
                    open={open}
                    onOpenChange={setOpen}
                    title="Add New Post"
                    onSubmit={addMutation.mutateAsync}
                    isSubmitting={addMutation.isPending}
                    triggerElement={<Button>New Post</Button>}
                />
            </PageHeader>
            <main className="p-3 space-y-2 overflow-y-auto justify-items-center">
                {data.data.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </main>
        </div>
    )
}
