import { Channel } from "@bchat/database/tables"
import { OtherUser, UserStatus } from "./users"
import { Prettify } from "./global"

export type Channels = {
    dms: {
        id: Channel["id"]
        friend: Prettify<OtherUser & UserStatus>
        // lastMessage: ChatMessage
        // unreadCount: number
    }[]
}

export type DMChat = Channels["dms"][number]
