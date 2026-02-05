import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import type { PostWithAuthor } from "@bchat/types"

export default function Post({ post }: { post: PostWithAuthor }) {
    const date = new Date(post.createdAt).toTimeString()
    return (
        <Card size="sm" className="mx-auto w-full max-w-sm">
            <CardHeader>
                <CardTitle>{post.author.name}</CardTitle>
                <CardDescription>
                    posted at <span>{date}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{post.content}</p>
            </CardContent>
            <CardFooter>
                comments : <span>{post.commentsCount}</span>
            </CardFooter>
        </Card>
    )
}
