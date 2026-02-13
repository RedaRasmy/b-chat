import Avatar from "@/components/avatar"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { useUser } from "@/features/auth/use-user"
import { DeleteChat } from "@/features/chats/components/delete-chat"
import { getChatAvatar, getChatName } from "@/features/chats/utils/chats"
import { getTime } from "@/features/chats/utils/get-time"
import { cn } from "@/lib/utils"
import type { DMChat } from "@bchat/types"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function DMHeader({ chat }: { chat: DMChat }) {
    const user = useUser()
    const name = getChatName(chat, user.id)
    const avatar = getChatAvatar(chat, user.id)
    const lastSeen =
        chat.lastSeen && chat.status === "offline"
            ? "since " + getTime(chat.lastSeen)
            : null

    const status = `${chat.status} ${lastSeen}`

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
                    <div className="text-xs text-muted-foreground">
                        <span>
                            <span className="text-primary">
                                {chat.typingUser}
                            </span>{" "}
                            is
                        </span>{" "}
                        typing...
                    </div>
                )}

                <DeleteChat chatId={chat.id}>
                    <Button variant={"destructive"}>
                        <HugeiconsIcon icon={Delete02Icon} />
                    </Button>
                </DeleteChat>
            </div>
        </PageHeader>
    )
}
