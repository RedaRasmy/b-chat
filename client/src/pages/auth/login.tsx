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
import z from "zod"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/use-auth"
import { loginRequest } from "@/features/auth/requests"
import { LoginSchema } from "@bchat/shared/validation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    ArrowLeft01Icon,
    LockKeyIcon,
    Mail02Icon,
    ViewIcon,
    ViewOffIcon,
} from "@hugeicons/core-free-icons"
import GoogleIcon from "@/components/google-icon"
import GithubIcon from "@/components/github-icon"

export default function LoginPage() {
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const [params] = useSearchParams()
    const error = params.get("error")

    const navigate = useNavigate()

    const { setUser } = useAuth()

    const mutation = useMutation({
        mutationFn: loginRequest,
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

    async function onSubmit(data: z.infer<typeof LoginSchema>) {
        mutation.mutate(data)
    }

    const errors = form.formState.errors
    const message = errors.root?.message ?? error ?? null

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-full h-screen bg-linear-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Home */}
                <Link to="/">
                    <Button variant="ghost" className="mb-6">
                        <HugeiconsIcon
                            className="h-4 w-4 mr-2"
                            icon={ArrowLeft01Icon}
                        />
                        Back to Home
                    </Button>
                </Link>

                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <p className="text-red-500">{message}</p>
                            {/* Email Field */}
                            <Controller
                                name="email"
                                control={form.control}
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
                                                {...field}
                                                id="email"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Enter your email"
                                                className="pl-10"
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
                                name="password"
                                control={form.control}
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
                                                {...field}
                                                id="password"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter your password"
                                                className="pl-10 pr-10"
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

                            {/* Sign In Button */}
                            <Button
                                type="submit"
                                className="w-full cursor-pointer mt-3"
                                size="lg"
                                disabled={form.formState.isSubmitting}
                            >
                                Sign in
                            </Button>
                        </form>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or sign in with
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

                        {/* Sign Up Link */}
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                Don't have an account?
                            </span>
                            <Link to="/auth/register">
                                <Button variant={"link"}>Sign up</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
