import Avatar from "@/components/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { OtherUser } from "@bchat/types"
import type { ReactNode } from "react"

export default function UserCard({
    user,
    children,
}: {
    user: OtherUser
    children: ReactNode
}) {
    return (
        <Card
            className={cn({
                "border-primary border": user.role === "admin",
            })}
        >
            <CardContent className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Avatar data={user} className="size-10" />
                    <h1 className="text-lg">{user.name}</h1>
                    {user.role === "admin" && (
                        <span className="text-xs text-primary">(admin)</span>
                    )}
                </div>
                <div className="flex gap-1">{children}</div>
            </CardContent>
        </Card>
    )
}
