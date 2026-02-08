import type { DMChat } from "@bchat/types"
import { Link } from "react-router-dom"

export default function ChatCard({ chat }: { chat: DMChat }) {
    return (
        <Link
            to={"/chats/" + chat.id}
            className="border block rounded-md px-3 py-1.5 cursor-pointer bg-accent hover:bg-primary hover:text-white hover:border-white"
        >
            {chat.friend.name}
        </Link>
    )
}
