import Avatar from "@/components/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { OtherUser } from "@bchat/types"
import type { ReactNode } from "react"

export default function UserCard({
    user,
    children,
    className,
}: {
    user: OtherUser
    children?: ReactNode
    className?: string
}) {
    return (
        <Card className={cn(className, "py-1.5 lg:py-3", {})}>
            <CardContent className="flex gap-1 justify-between items-center text-center px-2 lg:px-4">
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                    <Avatar data={user} className="size-10" />
                    <h1 className="text-lg overflow-hidden text-ellipsis text-nowrap">
                        {user.name}
                    </h1>
                </div>
                <div className="flex gap-1 items-center">{children}</div>
            </CardContent>
        </Card>
    )
}
