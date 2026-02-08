import { cn } from "@/lib/utils"
import type { ChatMessage, OtherUser } from "@bchat/types"

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
            className={cn(
                "bg-primary shrink-0 w-fit pr-3 pl-5 pt-3.5 pb-1 rounded-xl relative max-w-70 sm:max-w-100 lg:max-w-150 xl:max-w-200  text-ellipsis overflow-hidden",
                {
                    "self-end": isUser,
                },
            )}
        >
            {message.content}
            <span className="absolute top-0.5 left-2 text-[0.7rem] text-accent font-extralight">
                {sender.name}
            </span>
        </div>
    )
}
