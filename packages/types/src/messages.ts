import { Channel } from "@bchat/database/tables"

export type ClientMessage = {
    channelId: Channel["id"]
    content: string
    sentAt: number
}

export type TypingData = {
    channelId: string
    userName: string
    userId: string
}
