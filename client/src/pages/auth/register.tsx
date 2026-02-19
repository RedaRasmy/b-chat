import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { z } from "zod"
import { useAuth } from "@/features/auth/use-auth"
import { registerRequest } from "@/features/auth/requests"
import { RegisterSchema } from "@bchat/shared/validation"
import { Separator } from "@/components/ui/separator"
import GithubIcon from "@/components/github-icon"
import GoogleIcon from "@/components/google-icon"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    LockKeyIcon,
    Mail02Icon,
    User02Icon,
    ViewIcon,
    ViewOffIcon,
} from "@hugeicons/core-free-icons"

const Schema = RegisterSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function RegisterPage() {
    const form = useForm({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const navigate = useNavigate()
    const [params] = useSearchParams()
    const error = params.get("error")

    const { setUser } = useAuth()

    const mutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: async (user) => {
            setUser(user)
            navigate("/")
        },
        onError: (err) => {
            const message =
                (err.response?.data?.message as string) ||
                "Something went wrong , Please try again."
            form.setError("root", {
                message,
            })
        },
    })

    async function onSubmit(data: z.infer<typeof RegisterSchema>) {
        mutation.mutate(data)
    }

    const errors = form.formState.errors
    const message = errors.root?.message ?? error ?? null

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="w-full h-screen bg-linear-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Home */}
                {/* <Link to="/" className="inline-block mb-6">
                    <Button variant="ghost">
                        <HugeiconsIcon
                            className="h-4 w-4 mr-2"
                            icon={ArrowLeft01Icon}
                        />
                        Back to Home
                    </Button>
                </Link> */}

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            Create Account
                        </CardTitle>
                        <CardDescription>
                            Join us today and start your journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <p className="text-red-500">{message}</p>
                            {/* Name Field */}
                            <Controller
                                control={form.control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">
                                            Name
                                        </FieldLabel>
                                        <div className="relative">
                                            <HugeiconsIcon
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                                                icon={User02Icon}
                                            />
                                            <Input
                                                id={field.name}
                                                type="string"
                                                placeholder="Enter your name"
                                                className="pl-10"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                {...field}
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            {/* Email Field */}
                            <Controller
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <div className="relative">
                                            <HugeiconsIcon
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                                                icon={Mail02Icon}
                                            />
                                            <Input
                                                id={field.name}
                                                type="email"
                                                placeholder="Enter your email"
                                                className="pl-10"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                {...field}
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Password Field */}
                            <Controller
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">
                                            Password
                                        </FieldLabel>
                                        <div className="relative">
                                            <HugeiconsIcon
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                                                icon={LockKeyIcon}
                                            />
                                            <Input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Create a password"
                                                className="pl-10 pr-10"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <HugeiconsIcon
                                                        className="h-4 w-4"
                                                        icon={ViewOffIcon}
                                                    />
                                                ) : (
                                                    <HugeiconsIcon
                                                        className="h-4 w-4"
                                                        icon={ViewIcon}
                                                    />
                                                )}
                                            </Button>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Confirm Password Field */}
                            <Controller
                                control={form.control}
                                name="confirmPassword"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="confirmPassword">
                                            Confirm Password
                                        </FieldLabel>
                                        <div className="relative">
                                            <HugeiconsIcon
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                                                icon={LockKeyIcon}
                                            />
                                            <Input
                                                id="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Confirm your password"
                                                className="pl-10 pr-10"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <HugeiconsIcon
                                                        className="h-4 w-4"
                                                        icon={ViewOffIcon}
                                                    />
                                                ) : (
                                                    <HugeiconsIcon
                                                        className="h-4 w-4"
                                                        icon={ViewIcon}
                                                    />
                                                )}
                                            </Button>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            {/* Sign Up Button */}
                            <Button
                                type="submit"
                                size="lg"
                                className="cursor-pointer w-full mt-3"
                                disabled={mutation.isPending}
                            >
                                Create Account
                            </Button>
                        </form>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or sign up with
                                </span>
                            </div>
                        </div>

                        {/* OAuth Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer"
                                onClick={() => {
                                    window.location.href =
                                        "/api/auth/google/login"
                                }}
                            >
                                <GoogleIcon />
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer"
                                onClick={() => {
                                    window.location.href =
                                        "/api/auth/github/login"
                                }}
                            >
                                <GithubIcon />
                                Github
                            </Button>
                        </div>

                        {/* Sign In Link */}
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                Already have an account?
                            </span>
                            <Link to="/auth/login">
                                <Button variant={"link"}>Sign in</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
