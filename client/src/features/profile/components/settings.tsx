import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
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
import { TabsContent } from "@/components/ui/tabs"
import { fetchProfile, updateProfile } from "@/features/profile/requests"
import {
    UpdateProfileSchema,
    type UpdateProfileData,
} from "@bchat/shared/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

export default function Settings() {
    const form = useForm<UpdateProfileData>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            name: "",
        },
    })
    const queryClient = useQueryClient()

    const { data } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
    })

    useEffect(() => {
        if (data?.name) {
            form.reset({
                name: data.name,
            })
        }
    }, [data, form])

    console.log(data)

    const mutation = useMutation({
        mutationFn: updateProfile,
        onError: (err) => {
            console.error(err)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            })
        },
    })

    function onSubmit({ name }: UpdateProfileData) {
        if (name === "" || name === data?.name) {
            return
        }
        mutation.mutate({ name })
    }

    return (
        <TabsContent value="settings">
            <Card className="max-w-150">
                <CardHeader>
                    <CardTitle>Update Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
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
                                            Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your new name"
                                            autoComplete="off"
                                            type="text"
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
                    <Field orientation="horizontal">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            form="update-profile"
                        >
                            Submit
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}
