import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { OtherUser } from "@bchat/types"
import type { ReactNode } from "react"

export default function UserCard({
    user,
    children,
}: {
    user: Omit<OtherUser, "id">
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
                    <div className="size-10 rounded-full bg-primary text-xl text-foreground/70 uppercase flex items-center justify-center">
                        {user.name.charAt(0)}
                    </div>
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
