import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ClientMessage, OtherUser } from "@bchat/types"
import {
    Delete02Icon,
    Refresh01Icon,
    Tick02Icon,
    TickDouble02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getTime } from "@/features/chats/utils/get-time"

export default function Message({
    message,
    isUser,
    sender,
    onRetry,
    onDelete,
}: {
    message: ClientMessage
    isUser: boolean
    sender: OtherUser
    onRetry: (message: ClientMessage) => void
    onDelete: (messageId: string) => void
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
            <DropdownMenu disabled={!isUser}>
                <DropdownMenuTrigger
                    render={
                        <button
                            className={cn({
                                "opacity-60":
                                    isRetry || message.status === "sending",
                            })}
                        >
                            <div
                                className={cn(
                                    "bg-primary grid grid-rows-[5px_1fr] gap-2 w-fit px-2 py-1 pb-1 rounded-xl relative max-w-70 sm:max-w-100 lg:max-w-150 xl:max-w-200  text-ellipsis overflow-hidden",
                                )}
                            >
                                <div className=" text-[0.7rem] text-accent font-extralight flex justify-between gap-4">
                                    {sender.name}
                                    <span className="text-[0.65rem]">
                                        {getTime(message.createdAt)}
                                    </span>
                                </div>
                                <div className="w-full text-end px-4">
                                    {message.content}
                                </div>
                                {isUser && (
                                    <span className="absolute bottom-0 right-1 text-[0.6rem] text-muted/80 font-extralight">
                                        {isSeen ? (
                                            <HugeiconsIcon
                                                icon={TickDouble02Icon}
                                                size={"15"}
                                            />
                                        ) : isDelivered ? (
                                            <HugeiconsIcon
                                                icon={Tick02Icon}
                                                size={"15"}
                                            />
                                        ) : null}
                                    </span>
                                )}
                            </div>
                        </button>
                    }
                />
                <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>{message.content}</DropdownMenuLabel>
                        <DropdownMenuItem
                            className={"cursor-pointer"}
                            variant="destructive"
                            onClick={() => onDelete(message.id)}
                        >
                            <HugeiconsIcon icon={Delete02Icon} />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
