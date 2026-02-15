import Avatar from "@/components/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Friend } from "@bchat/types"
import type { ReactNode } from "react"

export default function FriendCard({
    friend,
    children,
}: {
    friend: Friend
    children: ReactNode
}) {
    return (
        <Card
            className={cn({
                "border-primary border": friend.role === "admin",
            })}
        >
            <CardContent className="flex justify-between items-center gap-1">
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                    <Avatar data={friend} className="size-10" />
                    <h1
                        title={friend.name}
                        className="text-lg overflow-hidden text-nowrap text-ellipsis"
                    >
                        {friend.name}
                    </h1>
                </div>
                <div className="flex gap-1">{children}</div>
            </CardContent>
        </Card>
    )
}
