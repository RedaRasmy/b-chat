import { Channel } from "@bchat/database/tables"
import { OtherUser } from "./users"
import { ChatMessage } from "./messages"

export type DMChat = {
    id: Channel["id"]
    type: "dm"
    lastMessage: ChatMessage | null
    members: OtherUser[]
    name: null
    avatar: null
}
export type GroupChat = {
    id: Channel["id"]
    type: "group"
    lastMessage: ChatMessage | null
    members: OtherUser[]
    name: string
    avatar: string | null
}

export type Chat = DMChat | GroupChat

export type Channels = (DMChat | GroupChat)[]
