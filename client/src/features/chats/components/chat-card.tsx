import UserAvatar from "@/components/avatar"
import { useAuth } from "@/features/auth/use-auth"
import type { DMChat, GroupChat } from "@bchat/types"
import { Link } from "react-router-dom"

export default function ChatCard({ chat }: { chat: DMChat | GroupChat }) {
    const { user } = useAuth()
    const chatName = chat.type === "dm" ? chat.friend.name : "group"

    const lastMessage = chat.lastMessage
    const time = lastMessage
        ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : null

    const isNew =
        lastMessage &&
        !lastMessage.seenAt &&
        user &&
        lastMessage.senderId !== user.id

    return (
        <Link
            to={"/chats/" + chat.id}
            className="border relative flex rounded-md  items-center justify-between px-3 py-1 cursor-pointer bg-accent"
        >
            <section className="flex gap-2 items-center">
                <UserAvatar
                    data={
                        chat.type === "dm"
                            ? chat.friend
                            : {
                                  id: chat.id,
                                  name: chatName,
                              }
                    }
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
