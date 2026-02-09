import z from "zod"

export const InsertMessageSchema = z.object({
    channelId: z.uuid(),
    sentAt: z.number(),
    content: z.string().min(1),
})

export const GetMessageSchema = z.object({
    channelId: z.uuid(),
    messageId: z.uuid(),
    senderId: z.uuid(),
})

export const MessageSeenSchema = z.object({
    channelId: z.uuid(),
})

export const TypingSchema = z.object({
    channelId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
})

export type GetMessageData = z.infer<typeof GetMessageSchema>
export type MessageDeliveredData = {
    messageId: string
    receiverId: string
    deliveredAt: Date
    channelId: string
}
export type SeeChatData = z.infer<typeof MessageSeenSchema>

export type ChatSeenData = {
    messageId: string
    userId: string
    seenAt: Date
    channelId: string
}
