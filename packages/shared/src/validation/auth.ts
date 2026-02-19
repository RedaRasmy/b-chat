import { z } from "zod"

export const NameSchema = z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be between 3 and 15 characters")
    .max(15, "Name must be between 3 and 15 characters")
    
export const EmailSchema = z
    .string()
    .min(1, "Email is required")
    .pipe(z.email())

export const PasswordSchema = z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters")

export const LoginSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
})

export const RegisterSchema = z.object({
    name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
})
