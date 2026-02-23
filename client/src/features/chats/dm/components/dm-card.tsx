import Avatar from "@/components/avatar"
import { useUser } from "@/features/auth/use-user"
import { getChatAvatar, getChatName } from "@/features/chats/utils/chats"
import { getTime } from "@/features/chats/utils/get-time"
import type { DMChat } from "@bchat/types"
import { Link } from "react-router-dom"

export default function DMCard({ chat }: { chat: DMChat }) {
    const user = useUser()
    const chatName = getChatName(chat, user.id)
    const chatAvatar = getChatAvatar(chat, user.id)
    const { lastMessage, typingUser, status } = chat

    const time = lastMessage ? getTime(lastMessage.createdAt) : null

    const isNew =
        lastMessage &&
        lastMessage.receipts.length > 0 &&
        lastMessage.receipts.find(
            (rec) => rec.userId === user.id && rec.seenAt === null,
        )

    const friend = chat.members.find((m) => m.id !== user.id)

    if (!friend) throw new Error("User is the only member in DM!")

    return (
        <Link
            to={"/chats/" + chat.id}
            className="border relative grid gap-2 gap-y-0 grid-cols-[auto_1fr] grid-rows-[auto_1fr] rounded-md items-center justify-between px-2 py-1 cursor-pointer bg-accent"
        >
            <Avatar
                className="row-span-2"
                data={{
                    id: friend.id,
                    name: chatName,
                    avatar: chatAvatar,
                    status,
                }}
            />
            <section className="grid grid-cols-[1fr_auto] gap-2 ">
                <h1 className="text-sm  text-nowrap overflow-hidden text-ellipsis ">
                    {chatName}
                </h1>
                <span className="text-[0.65rem] h-full text-muted-foreground ">
                    {time}
                </span>
            </section>
            <span className="text-xs text-muted-foreground text-nowrap overflow-hidden text-ellipsis">
                {typingUser ? (
                    <span className="text-primary">typing...</span>
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
