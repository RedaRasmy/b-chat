import { z } from "zod"

export const NameSchema = z
    .string()
    .min(1, "errors.nameRequired")
    .min(3, "errors.nameLength")
    .max(15, "errors.nameLength")

export const EmailSchema = z
    .string()
    .min(1, "errors.emailRequired")
    .pipe(z.email("errors.emailInvalid"))

export const PasswordSchema = z
    .string()
    .min(1, "errors.passwordRequired")
    .min(8, "errors.passwordMinLength")
    .max(50, "errors.passwordMaxLength")

export const LoginSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
})

export const RegisterSchema = z.object({
    name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
})
