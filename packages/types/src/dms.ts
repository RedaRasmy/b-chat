import { Channel, ChatMessage } from "@bchat/database/tables"
import { OtherUser, UserStatus } from "./users"
import { Prettify } from "./global"

export type DMChat = {
    id: Channel["id"]
    type: "dm"
    lastMessage: ChatMessage | null
    friend: Prettify<OtherUser & UserStatus>
}
export type GroupChat = {
    id: Channel["id"]
    type: "group"
    lastMessage: ChatMessage | null
    members: OtherUser[]
    // name ... TODO
}

export type Channels = (DMChat | GroupChat)[]
