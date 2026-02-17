import z from "zod"

export const SendMessageSchema = z.object({
    channelId: z.uuid(),
    tempId: z.string(),
    content: z.string().min(1),
})

export const GetMessageSchema = z.object({
    channelId: z.uuid(),
    messageId: z.uuid(),
    senderId: z.uuid(),
})

export const SeeChatSchema = z.object({
    channelId: z.uuid(),
})

export const TypingSchema = z.object({
    channelId: z.uuid(),
    userId: z.uuid(),
    userName: z.string(),
})

export type SendTypingData = z.infer<typeof TypingSchema>

export type GetMessageData = z.infer<typeof GetMessageSchema>

export type SeeChatData = z.infer<typeof SeeChatSchema>

export type SendMessageData = z.infer<typeof SendMessageSchema>


