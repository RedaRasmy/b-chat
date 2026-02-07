import z from "zod"

export const InsertMessageSchema = z.object({
    sentAt: z.number(),
    content: z.string().min(1),
})
