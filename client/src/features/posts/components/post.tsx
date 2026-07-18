import Avatar from "@/components/avatar"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardAction,
} from "@/components/ui/card"
import { getTime } from "@/features/chats/utils/get-time"
import type { PostWithAuthor } from "@bchat/types"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

export default function Post({
    post,
    children,
}: {
    post: PostWithAuthor
    children?: ReactNode
}) {
    const date = getTime(post.createdAt)

    const { t } = useTranslation("posts")

    return (
        <Card className="w-full max-w-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Avatar data={post.author} className="size-9" />
                    <section>
                        {post.author.name}
                        <div className="text-xs text-muted-foreground">
                            {t("post.postedAt")} <span>{date}</span>
                            {post.isEdited && (
                                <span className="ml-2">
                                    ({t("post.edited")})
                                </span>
                            )}
                        </div>
                    </section>
                </CardTitle>
                <CardAction className="space-x-0.5 ">{children}</CardAction>
            </CardHeader>
            <CardContent>
                <p className="wrap-break-word whitespace-pre-wrap">
                    {post.content}
                </p>
            </CardContent>
        </Card>
    )
}
