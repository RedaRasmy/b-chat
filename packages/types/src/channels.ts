import { Channel, User } from "@bchat/database/tables"
import { OtherUser } from "./users"
import { ChatMessage } from "./messages"

export type DMChat = {
    id: Channel["id"]
    type: "dm"
    lastMessage: ChatMessage | null
    members: OtherUser[]
    name: null
    avatar: null
    status?: User["status"]
    lastSeen?: User["lastSeen"]
    typingUser?: User["name"]
}

export type GroupChat = {
    id: Channel["id"]
    type: "group"
    lastMessage: ChatMessage | null
    members: OtherUser[]
    name: string
    avatar: string | null
    typingUser?: User["name"]
}

export type Chat = DMChat | GroupChat

export type Channels = (DMChat | GroupChat)[]
