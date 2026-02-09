import { Channel, ChatMessage } from "@bchat/database/tables"
import { OtherUser, UserStatus } from "./users"
import { Prettify } from "./global"

export type DMChat = {
    id: Channel["id"]
    type: "dm"
    lastMessages: ChatMessage[]
    unreadCount: number | string
    friend: Prettify<OtherUser & UserStatus>
}
export type GroupChat = {
    id: Channel["id"]
    type: "group"
    lastMessages: ChatMessage[]
    unreadCount: number | string
    members: OtherUser[]
    // name ... TODO
}

export type Channels = (DMChat | GroupChat)[]
