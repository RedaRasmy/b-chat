import { Channel, ChatMessage } from "@bchat/database/tables"
import { OtherUser } from "./users"

export type Channels = {
    dms: {
        id: Channel["id"]
        friend: OtherUser
        // lastMessage: ChatMessage
        // unreadCount: number
    }[]
}

export type DMChat = Channels["dms"][number]
