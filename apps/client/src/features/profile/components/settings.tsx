import { ActionButton } from "@/components/action-button"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/features/auth/use-auth"
import { useUser } from "@/features/auth/use-user"
import { deleteAccount, updateProfile } from "@/features/profile/requests"
import {
    UpdateProfileSchema,
    type UpdateProfileData,
} from "@bchat/shared/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"
import LangSelector from "@/components/lang-selector"
import ThemeSelector from "@/components/theme-selector"

export default function Settings() {
    const { logout } = useAuth()
    const form = useForm<UpdateProfileData>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            name: "",
        },
    })

    const user = useUser()
    const { refresh } = useAuth()
    const nameUnchanged = form.watch("name") === user.name

    useEffect(() => {
        form.reset({
            name: user.name,
        })
    }, [user.name])

    const mutation = useMutation({
        mutationFn: updateProfile,
        onError: (err) => {
            console.error(err)
        },
        onSuccess: () => {
            refresh()
        },
    })
    const deleteMutation = useMutation({
        mutationFn: deleteAccount,
        onError: (err) => {
            console.error(err)
        },
        onSuccess: async () => {
            await logout()
        },
    })

    function reset() {
        form.reset({
            name: user.name,
        })
    }

    function onSubmit({ name }: UpdateProfileData) {
        mutation.mutate({ name })
    }

    const { t } = useTranslation(["profile"])

    return (
        <div className={"grid md:grid-cols-2 gap-2 p-1"}>
            <Card className="">
                <CardHeader>
                    <CardTitle>{t("profile:profileUpdating.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        id="update-profile"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">
                                            {t(
                                                "profile:profileUpdating.name.label",
                                            )}
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder={t(
                                                "profile:profileUpdating.name.placeholder",
                                            )}
                                            autoComplete="off"
                                            type="text"
                                            className="max-w-100"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal" className="gap-1">
                        <Button
                            variant={"outline"}
                            disabled={nameUnchanged}
                            onClick={reset}
                        >
                            {t("common:buttons.reset")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending || nameUnchanged}
                            form="update-profile"
                        >
                            {t("common:buttons.submit")}
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
            <Card className="flex">
                <CardHeader>
                    <CardTitle className="">
                        {t("profile:preferences.title")}
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="select-lang">
                            {t("profile:preferences.language.label")}
                        </Label>
                        <LangSelector />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="select-theme">
                            {t("profile:preferences.theme.label")}
                        </Label>
                        <ThemeSelector />
                    </div>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal"></Field>
                </CardFooter>
            </Card>
            <Card className="">
                <CardHeader>
                    <CardTitle className="text-de">
                        {t("profile:accountDeletion.title")}
                    </CardTitle>
                    <CardDescription>
                        {t("profile:accountDeletion.description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ActionButton
                        action={deleteMutation.mutate}
                        requireAreYouSure
                        triggerElement={
                            <Button variant={"destructive"}>
                                {t("common:buttons.delete")}
                            </Button>
                        }
                    />
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal"></Field>
                </CardFooter>
            </Card>
        </div>
    )
}
