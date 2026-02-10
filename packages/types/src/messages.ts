import { Channel, ChatMessage } from "@bchat/database/tables"
import { Prettify } from "./global"

export type SendMessageData = {
    channelId: Channel["id"]
    content: string
    tempId: string
}

export type TypingData = {
    channelId: string
    userName: string
    userId: string
}

export type MessageAck =
    | {
          success: true
          messageId: string
          tempId: string
          channelId: string
      }
    | {
          success: false
          tempId: string
          channelId: string
      }

export type ClientMessage = Prettify<
    ChatMessage & {
        status?: "sending" | "failed" | "sent"
    }
>
