import Avatar from "@/components/avatar"
import { useUser } from "@/features/auth/use-user"
import { getTime } from "@/features/chats/utils/get-time"
import type { GroupChat } from "@bchat/types"
import { Link } from "react-router-dom"

export default function GroupCard({ chat }: { chat: GroupChat }) {
    const user = useUser()

    const { lastMessage, typingUser } = chat

    const time = lastMessage ? getTime(lastMessage.createdAt) : null

    const isNew =
        lastMessage &&
        lastMessage.receipts.length > 0 &&
        lastMessage.receipts.find(
            (rec) => rec.userId === user.id && rec.seenAt === null,
        )

    return (
        <Link
            aria-label="Group chat"
            to={"/chats/" + chat.id}
            className="border relative grid gap-2 gap-y-0 grid-cols-[auto_1fr] grid-rows-[auto_1fr] rounded-md items-center justify-between px-2 py-1 cursor-pointer bg-accent"
        >
            <Avatar
                className="row-span-2 "
                data={{
                    id: chat.id,
                    name: chat.name,
                    avatar: chat.avatar,
                }}
            />
            <section className="grid grid-cols-[1fr_auto] gap-2 ">
                <h1 className="text-sm  text-nowrap overflow-hidden text-ellipsis ">
                    {chat.name}
                </h1>
                <span className="text-[0.65rem] h-full text-muted-foreground ">
                    {time}
                </span>
            </section>
            <span className="text-xs text-muted-foreground text-nowrap overflow-hidden text-ellipsis">
                {typingUser ? (
                    <span className="text-primary">
                        {typingUser} is typing...
                    </span>
                ) : (
                    lastMessage?.content
                )}
            </span>
            {isNew && (
                <div className="size-2 bg-primary rounded-full absolute top-0 right-0 -translate-y-1/2 translate-x-1/2" />
            )}
        </Link>
    )
}
