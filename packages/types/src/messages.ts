import { Channel } from "@bchat/database/tables"

export type ClientMessage = {
    channelId: Channel["id"]
    content: string
    sentAt: number
}
