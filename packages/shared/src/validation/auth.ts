import { z } from "zod"

export const LoginSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be between 8 and 50 characters")
        .max(50, "Password must be between 8 and 50 characters"),
})

export const NameSchema = z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be between 3 and 30 characters")
    .max(30, "Name must be between 3 and 30 characters")

export const RegisterSchema = z.object({
    name: NameSchema,
    email: z.email(),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be between 8 and 50 characters")
        .max(50, "Password must be between 8 and 50 characters"),
})
