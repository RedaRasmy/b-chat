import UserAvatar from "@/components/avatar"
import type { DMChat, GroupChat } from "@bchat/types"
import { Link } from "react-router-dom"

export default function ChatCard({ chat }: { chat: DMChat | GroupChat }) {
    const chatName = chat.type === "dm" ? chat.friend.name : "group"
    const lastMessage = chat.lastMessages[0]
    const time = lastMessage
        ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
          })
        : null
    const isNew = typeof chat.unreadCount === "string" || chat.unreadCount > 0
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
                        {lastMessage && lastMessage.content}
                    </span>
                </div>
            </section>
            <section className="text-[0.65rem] h-full text-muted-foreground ">
                {time}
            </section>
            {isNew && (
                <div className="size-4.5 flex items-center justify-center text-white text-[0.55rem] bg-primary rounded-full absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    {chat.unreadCount}
                </div>
            )}
        </Link>
    )
}
