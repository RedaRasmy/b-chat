import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ClientMessage, OtherUser } from "@bchat/types"
import {
    Refresh01Icon,
    Tick02Icon,
    TickDouble02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function Message({
    message,
    isUser,
    sender,
    onRetry,
}: {
    message: ClientMessage
    isUser: boolean
    sender: OtherUser
    onRetry: (message: ClientMessage) => void
}) {
    const isRetry = isUser && message.status === "failed"
    const isSeen = message.receipts.every((rec) => rec.seenAt)
    const isDelivered = message.receipts.every((rec) => rec.deliveredAt)

    return (
        <div
            className={cn("flex items-center gap-2", {
                "justify-end": isUser,
            })}
        >
            {isRetry && (
                <Button
                    variant={"outline"}
                    size={"icon-sm"}
                    onClick={() => onRetry(message)}
                >
                    <HugeiconsIcon icon={Refresh01Icon} />
                </Button>
            )}
            <div
                className={cn({
                    "opacity-60": isRetry || message.status === "sending",
                })}
            >
                <div
                    className={cn(
                        "bg-primary shrink-0 w-fit px-5 py-3.5 pb-1 rounded-xl relative max-w-70 sm:max-w-100 lg:max-w-150 xl:max-w-200  text-ellipsis overflow-hidden",
                    )}
                >
                    {message.content}
                    <span className="absolute top-0.5 left-2 text-[0.7rem] text-accent font-extralight">
                        {sender.name}
                    </span>
                    {isUser && (
                        <span className="absolute bottom-0 right-1 text-[0.6rem] text-muted/80 font-extralight">
                            {isSeen ? (
                                <HugeiconsIcon
                                    icon={TickDouble02Icon}
                                    size={"15"}
                                />
                            ) : isDelivered ? (
                                <HugeiconsIcon icon={Tick02Icon} size={"15"} />
                            ) : null}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
