import Avatar from "@/components/avatar"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { DeleteChat } from "@/features/chats/components/delete-chat"
import { useDM } from "@/features/chats/dm/use-dm"
import { getTime } from "@/features/chats/utils/get-time"
import { cn } from "@/lib/utils"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function DMHeader() {
    const { friend, chat } = useDM()
    const name = friend.name
    const avatar = friend.avatar
    const lastSeen =
        chat.lastSeen && chat.status === "offline"
            ? "since " + getTime(chat.lastSeen)
            : null

    const status =
        chat.status === "online" ? "online" : `${chat.status} ${lastSeen}`

    return (
        <PageHeader>
            <div className="flex items-center gap-2">
                <Avatar
                    data={{
                        id: chat.id,
                        name,
                        avatar,
                    }}
                />
                <div className="flex flex-col -space-y-0.5">
                    <h1>{name}</h1>
                    <div
                        className={cn(
                            "text-[0.7rem] text-muted-foreground flex gap-",
                            {
                                "text-primary": chat.status === "online",
                            },
                        )}
                    >
                        {status}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                {chat.typingUser && (
                    <span className="text-xs text-muted-foreground">
                        typing...
                    </span>
                )}

                <DeleteChat chatId={chat.id}>
                    <Button variant={"destructive"} aria-label="Delete chat">
                        <HugeiconsIcon icon={Delete02Icon} />
                    </Button>
                </DeleteChat>
            </div>
        </PageHeader>
    )
}
