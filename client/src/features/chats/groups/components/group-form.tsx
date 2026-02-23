import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/components/ui/sidebar"
import { createGroup } from "@/features/chats/requests"
import { fetchFriends } from "@/features/friendships/requests"
import { InsertGroupSchema, type GroupFormData } from "@bchat/shared/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

export function GroupFormDialog() {
    const [open, setOpen] = useState(false)
    const { setOpenMobile } = useSidebar()
    const form = useForm<GroupFormData>({
        resolver: zodResolver(InsertGroupSchema),
        defaultValues: {
            name: "",
            members: [],
        },
    })

    const { data: friends } = useQuery({
        queryKey: ["friends"],
        queryFn: fetchFriends,
    })

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createGroup,
        onSuccess: async (group) => {
            form.reset()
            setOpen(false)
            await queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
            navigate("/chats/" + group.channelId)
            setOpenMobile(false)
        },
    })

    function onSubmit(data: GroupFormData) {
        mutation.mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button variant="outline" size={"icon-xs"}>
                        <HugeiconsIcon icon={PlusSignIcon} />
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-sm">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3"
                >
                    <DialogHeader>
                        <DialogTitle>Create New Group</DialogTitle>
                        <DialogDescription>
                            Make a chat room to talk with your friends.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="group-name">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="group-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder=""
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="members"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Members</FieldLabel>
                                    {friends ? (
                                        <div className="grid gap-1 max-h-70 overflow-auto">
                                            {friends.map((friend) => (
                                                <div
                                                    key={friend.id}
                                                    className="flex items-center p-2 border rounded-md gap-2"
                                                >
                                                    <Checkbox
                                                        checked={
                                                            !!field.value.includes(
                                                                friend.id,
                                                            )
                                                        }
                                                        className={
                                                            "cursor-pointer"
                                                        }
                                                        onCheckedChange={(
                                                            checked,
                                                        ) => {
                                                            const newValue =
                                                                checked
                                                                    ? [
                                                                          ...field.value,
                                                                          friend.id,
                                                                      ]
                                                                    : field.value.filter(
                                                                          (
                                                                              value,
                                                                          ) =>
                                                                              value !==
                                                                              friend.id,
                                                                      )
                                                            field.onChange(
                                                                newValue,
                                                            )
                                                        }}
                                                    />
                                                    <div className="flex">
                                                        {friend.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>No friends yet</div>
                                    )}
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        />
                        <Button type="submit" disabled={mutation.isPending}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
