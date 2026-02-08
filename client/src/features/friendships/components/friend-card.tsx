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
            <CardContent className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-full bg-primary text-xl text-foreground/70 uppercase flex items-center justify-center">
                        {friend.name.charAt(0)}
                        <div
                            className={cn(
                                "size-3 bg-red-500 absolute bottom-0 right-0 rounded-full",
                                {
                                    "bg-green-500": friend.status === "online",
                                },
                            )}
                        ></div>
                    </div>
                    <h1 className="text-lg">{friend.name}</h1>
                    {friend.role === "admin" && (
                        <span className="text-xs text-primary">(admin)</span>
                    )}
                </div>
                <div className="flex gap-1">{children}</div>
            </CardContent>
        </Card>
    )
}
