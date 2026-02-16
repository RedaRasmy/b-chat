import { Message, MessageReceipt } from "@bchat/database/tables"
import { Prettify } from "./global"

export type ChatMessage = Prettify<
    Message & {
        receipts: MessageReceipt[]
    }
>

export type SendMessageData = {
    channelId: string
    content: string
    tempId: string
}

export type MessageDeletedData = {
    channelId: string
    messageId: string
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
          error?: string
      }

export type ClientMessage = Prettify<
    ChatMessage & {
        status?: "sending" | "failed" | "sent"
    }
>
