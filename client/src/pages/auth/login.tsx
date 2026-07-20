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
    LockKeyIcon,
    Mail02Icon,
    ViewIcon,
    ViewOffIcon,
} from "@hugeicons/core-free-icons"
import GoogleIcon from "@/components/google-icon"
import GithubIcon from "@/components/github-icon"
import { useTranslation } from "react-i18next"

export default function LoginPage() {
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const [params] = useSearchParams()
    const { t } = useTranslation("auth")

    const urlError = params.get("error")
    const error = urlError
        ? t(`errors.${urlError}`, { defaultValue: urlError })
        : null

    const navigate = useNavigate()

    const { setUser } = useAuth()

    const mutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: async (user) => {
            setUser(user)
            navigate("/")
        },
        onError: (err) => {
            const unkownError = t("errors.unkownError")

            const errorKey = err.response?.data.message

            const message = errorKey
                ? t(`errors.${errorKey}`, {
                      defaultValue: unkownError,
                  })
                : unkownError

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

    console.log(form.getFieldState("email").error?.message)
    console.log(form.getFieldState("password").error?.message)

    return (
        <div className="w-full h-screen bg-linear-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Home */}
                {/* <Link to="/">
                    <Button variant="ghost" className="mb-6">
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
                            {t("loginForm.title")}
                        </CardTitle>
                        <CardDescription>
                            {t("loginForm.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                            noValidate
                        >
                            <p className="text-red-500">{message}</p>
                            {/* Email Field */}
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">
                                            {t("loginForm.email.label")}
                                        </FieldLabel>
                                        <div className="relative">
                                            <HugeiconsIcon
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                                                icon={Mail02Icon}
                                            />
                                            <Input
                                                {...field}
                                                id="email"
                                                type="email"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder={t(
                                                    "loginForm.email.placeholder",
                                                )}
                                                className="pl-10"
                                            />
                                        </div>
                                        {fieldState.error?.message && (
                                            <FieldError
                                                errors={[
                                                    {
                                                        message: t(
                                                            fieldState.error
                                                                ?.message!,
                                                        ),
                                                    },
                                                ]}
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
                                            {t("loginForm.password.label")}
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
                                                placeholder={t(
                                                    "loginForm.password.placeholder",
                                                )}
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
                                        {fieldState.error?.message && (
                                            <FieldError
                                                errors={[
                                                    {
                                                        message: t(
                                                            fieldState.error
                                                                ?.message!,
                                                        ),
                                                    },
                                                ]}
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
                                disabled={mutation.isPending}
                            >
                                {t("buttons.signin")}
                            </Button>
                        </form>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    {t("loginForm.seperator")}
                                </span>
                            </div>
                        </div>

                        {/* OAuth Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer"
                                onClick={() => {
                                    window.location.href = `${import.meta.env.DEV ? import.meta.env.VITE_API_URL : ""}/api/auth/google/login`
                                }}
                            >
                                <GoogleIcon />
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full cursor-pointer"
                                onClick={() => {
                                    window.location.href = `${import.meta.env.DEV ? import.meta.env.VITE_API_URL : ""}/api/auth/github/login`
                                }}
                            >
                                <GithubIcon />
                                Github
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                {t("loginForm.question")}
                            </span>
                            <Link to="/auth/register">
                                <Button variant={"link"}>
                                    {t("loginForm.link")}
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
