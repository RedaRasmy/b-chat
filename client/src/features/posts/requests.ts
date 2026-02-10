import { api } from "@/lib/api"
import type {
    CommentFormData,
    PaginatedResult,
    PostCommentsQuery,
    PostFormData,
    PostsQuery,
} from "@bchat/shared/validation"
import type {
    CommentWithAuthor,
    Post,
    Comment,
    PostWithAuthor,
} from "@bchat/types"

export async function fetchPosts(query: PostsQuery) {
    const res = await api.get("/posts", {
        params: query,
    })
    return res.data as PaginatedResult<PostWithAuthor[]>
}

export async function fetchPost(data: PostFormData) {
    const res = await api.post("/posts", data)
    return res.data as Post
}

export async function updatePost({
    id,
    data,
}: {
    id: Post["id"]
    data: PostFormData
}) {
    const res = await api.patch("/posts/" + id, data)
    return res.data as Post
}

export async function deletePost(id: Post["id"]) {
    const res = await api.delete("/posts/" + id)
    return res
}

export async function fetchPostComments({
    id,
    query,
}: {
    id: Post["id"]
    query: PostCommentsQuery
}) {
    const res = await api.get(`/posts/${id}/comments`, {
        params: query,
    })

    return res.data as PaginatedResult<CommentWithAuthor[]>
}

export async function addComment({
    id,
    data,
}: {
    id: Post["id"]
    data: CommentFormData
}) {
    const res = await api.post(`/posts/${id}/comments`, data)

    return res.data as Comment
}
