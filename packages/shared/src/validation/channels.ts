import z from "zod"

export const InsertDMSchema = z.object({
    friendId: z.uuid(),
})
export const InsertGroupSchema = z.object({
    name: z
        .string()
        .min(1, "Group name is required")
        .min(3, "Name length must be between 3 and 20")
        .max(20, "Name length must be between 3 and 20"),
    members: z.array(z.uuid()),
})

export const UpdateGroupSchema = z.object({
    name: z
        .string()
        .min(1, "Group name is required")
        .min(3, "Name length must be between 3 and 20")
        .max(20, "Name length must be between 3 and 20"),
})

export type UpdateGroupData = {
    name: string
}

export type DMFormData = z.infer<typeof InsertDMSchema>
export type GroupFormData = z.infer<typeof InsertGroupSchema>

export const NewDMSchema = z.object({
    channelId: z.uuid(),
    friendId: z.uuid(),
})
