import z from "zod"

export const InsertMessageSchema = z.object({
    channelId: z.uuid(),
    sentAt: z.number(),
    content: z.string().min(1),
})
