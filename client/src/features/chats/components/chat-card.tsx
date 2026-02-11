import Avatar from "@/components/avatar"
import { useAuth } from "@/features/auth/use-auth"
import { getChatAvatar, getChatName } from "@/features/chats/utils/chats"
import { fetchFriends } from "@/features/friendships/requests"
import type { DMChat, GroupChat } from "@bchat/types"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

export default function ChatCard({ chat }: { chat: DMChat | GroupChat }) {
    const { user } = useAuth()
    const { data: friends } = useQuery({
        queryKey: ["friends"],
        queryFn: fetchFriends,
        staleTime: Infinity,
    })

    if (!user) return

    const friendId = chat.members.find((m) => m.id !== user.id)?.id
    const friend =
        chat.type === "dm" && friends
            ? friends.find((f) => f.id === friendId)
            : undefined

    const chatName = getChatName(chat, user.id)
    const chatAvatar = getChatAvatar(chat, user.id)

    const lastMessage = chat.lastMessage

    const time = lastMessage
        ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : null

    const isNew =
        lastMessage &&
        lastMessage.receipts.length > 0 &&
        lastMessage.receipts.find(
            (rec) => rec.userId === user.id && rec.seenAt === null,
        )

    return (
        <Link
            to={"/chats/" + chat.id}
            className="border relative flex rounded-md  items-center justify-between px-3 py-1 cursor-pointer bg-accent"
        >
            <section className="flex gap-2 items-center">
                <Avatar
                    data={{
                        id: chat.id,
                        name: chatName,
                        avatar: chatAvatar,
                        status: friend?.status,
                    }}
                />
                <div>
                    <h1 className="text-sm">{chatName}</h1>
                    <span className="text-xs text-muted-foreground ml-2">
                        {lastMessage?.content}
                    </span>
                </div>
            </section>
            <section className="text-[0.65rem] h-full text-muted-foreground ">
                {time}
            </section>
            {isNew && (
                <div className="size-2 bg-primary rounded-full absolute top-0 right-0 -translate-y-1/2 translate-x-1/2" />
            )}
        </Link>
    )
}
