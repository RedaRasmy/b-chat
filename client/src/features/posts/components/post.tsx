import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
    CardAction,
} from "@/components/ui/card"
import type { PostWithAuthor } from "@bchat/types"
import type { ReactNode } from "react"

export default function Post({
    post,
    children,
}: {
    post: PostWithAuthor
    children?: ReactNode
}) {
    const date = new Date(post.createdAt).toLocaleDateString()
    return (
        <Card className="w-full max-w-200">
            <CardHeader>
                <CardTitle>{post.author.name}</CardTitle>
                <CardDescription>
                    posted at <span>{date}</span>
                </CardDescription>
                <CardAction className="space-x-0.5">{children}</CardAction>
            </CardHeader>
            <CardContent>
                <p className="wrap-break-word whitespace-pre-wrap">
                    {post.content}
                </p>
            </CardContent>
            {/* <CardFooter className="">
                comments : <span>{post.commentsCount}</span>
            </CardFooter> */}
        </Card>
    )
}
