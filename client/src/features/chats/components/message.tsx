import { cn } from "@/lib/utils"
import type { ChatMessage, OtherUser } from "@bchat/types"
import { Tick02Icon, TickDouble02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function Message({
    message,
    isUser,
    sender,
}: {
    message: ChatMessage
    isUser: boolean
    sender: OtherUser
}) {
    return (
        <div
            className={cn("flex", {
                "justify-end": isUser,
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
                        {message.seenAt ? (
                            <HugeiconsIcon
                                icon={TickDouble02Icon}
                                size={"15"}
                            />
                        ) : message.deliveredAt ? (
                            <HugeiconsIcon icon={Tick02Icon} size={"15"} />
                        ) : null}
                    </span>
                )}
            </div>
        </div>
    )
}
