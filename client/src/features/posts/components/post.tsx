import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import type { PostWithAuthor } from "@bchat/types"

export default function Post({ post }: { post: PostWithAuthor }) {
    const date = new Date(post.createdAt).toLocaleDateString()
    return (
        <Card className="w-full md:w-120 lg:w-180 xl:w-200 ">
            <CardHeader>
                <CardTitle>{post.author.name}</CardTitle>
                <CardDescription>
                    posted at <span>{date}</span>
                </CardDescription>
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
