import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError } from "@/components/ui/field"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { InsertPostSchema, type PostFormData } from "@bchat/shared/validation"

type Props = {
    title: string
    onSubmit: (data: PostFormData) => Promise<unknown>
    initialData?: PostFormData
    isSubmitting: boolean
    onOpenChange?: (open: boolean) => void
    open?: boolean
    triggerText: string
}

export function PostForm({
    onSubmit,
    title,
    initialData,
    isSubmitting,
    triggerText,
    onOpenChange,
    open,
}: Props) {
    const form = useForm<PostFormData>({
        resolver: zodResolver(InsertPostSchema),
        defaultValues: initialData ?? {
            content: "",
        },
    })

    async function handleSubmit(data: PostFormData) {
        try {
            await onSubmit(data)
            form.reset()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data.messsage || "Failed to save category"
                form.setError("root", {
                    message,
                })
            } else {
                form.setError("root", {
                    message: "An unexpected error occurred",
                })
            }
        }
    }

    const error = form.formState.errors.root?.message

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogTrigger render={<Button>{triggerText}</Button>} />
            <DialogContent className="sm:max-w-106.25 ">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-1 w-full"
                >
                    <div className="text-destructive">{error}</div>
                    <Controller
                        name="content"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="grid"
                            >
                                <Textarea
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Share your thoughts with others..."
                                    autoComplete="off"
                                    className="max-h-100"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <DialogClose
                            render={
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            }
                        ></DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
