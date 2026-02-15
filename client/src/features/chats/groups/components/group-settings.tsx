import { ActionButton } from "@/components/action-button"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddMembersForm } from "@/features/chats/groups/components/add-members-form"
import { DeleteChat } from "@/features/chats/components/delete-chat"
import { useGroup } from "@/features/chats/groups/use-group"
import { exitGroup, updateGroup } from "@/features/chats/requests"
import {
    UpdateGroupSchema,
    type UpdateGroupData,
} from "@bchat/shared/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Delete02Icon,
    Logout02Icon,
    MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { sortMembers } from "@/features/chats/utils/sort-members"
import { useUser } from "@/features/auth/use-user"
import Member from "@/features/chats/groups/components/member"

export function GroupSettings() {
    const { chat, isAdmin, isOwner } = useGroup()
    const { id } = useUser()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const form = useForm<UpdateGroupData>({
        resolver: zodResolver(UpdateGroupSchema),
        defaultValues: {
            name: chat.name,
        },
    })

    const exitMutation = useMutation({
        mutationFn: exitGroup,
        onSuccess: () => {
            navigate("/")
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: updateGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        },
    })
    function onSubmit(data: UpdateGroupData) {
        updateMutation.mutate({
            id: chat.id,
            data,
        })
    }

    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button variant="outline" size={"icon"}>
                        <HugeiconsIcon icon={MoreHorizontalIcon} />
                    </Button>
                }
            />
            <SheetContent className={"-space-y-4 pb-5"}>
                <SheetHeader>
                    <SheetTitle className={"text-xl"}>{chat.name}</SheetTitle>
                </SheetHeader>
                <Tabs
                    defaultValue="members"
                    className="w-full h-full p-2 grid grid-rows-[auto_1fr] "
                >
                    <TabsList className={"w-full"}>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="members"
                        className={
                            "space-y-1.5 overflow-auto h-full px-1 pt-1 pb-13"
                        }
                    >
                        {chat.members
                            .filter((mem) => mem.status === "active")
                            .sort(sortMembers(id))
                            .map((member) => (
                                <Member member={member} />
                            ))}
                    </TabsContent>
                    <TabsContent
                        value="settings"
                        className={
                            "space-y-2 overflow-auto h-full px-1 pt-1 pb-13"
                        }
                    >
                        {isOwner && (
                            <Card className="">
                                <CardHeader>
                                    <CardTitle>Group Name</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        id="update-group"
                                        onSubmit={form.handleSubmit(onSubmit)}
                                    >
                                        <Controller
                                            name="name"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <Input
                                                        {...field}
                                                        id="name"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        placeholder=""
                                                        autoComplete="off"
                                                        type="text"
                                                        className="max-w-100"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </form>
                                </CardContent>
                                <CardFooter>
                                    <Field orientation="horizontal">
                                        <Button
                                            type="submit"
                                            disabled={updateMutation.isPending}
                                            form="update-group"
                                        >
                                            Update
                                        </Button>
                                    </Field>
                                </CardFooter>
                            </Card>
                        )}
                        {(isAdmin || isOwner) && (
                            <AddMembersForm
                                channelId={chat.id}
                                members={chat.members
                                    .filter((mem) => mem.status === "active")
                                    .map((m) => m.id)}
                            />
                        )}
                        {!isOwner && (
                            <ActionButton
                                action={() => exitMutation.mutate(chat.id)}
                                requireAreYouSure
                                triggerElement={
                                    <Button
                                        variant={"destructive"}
                                        className={"w-full"}
                                        size={"lg"}
                                    >
                                        <HugeiconsIcon icon={Logout02Icon} />
                                        Exit Group
                                    </Button>
                                }
                            ></ActionButton>
                        )}
                        {isOwner && (
                            <DeleteChat chatId={chat.id}>
                                <Button
                                    variant={"destructive"}
                                    className={"w-full"}
                                    size={"lg"}
                                >
                                    <HugeiconsIcon icon={Delete02Icon} />
                                    Delete Chat
                                </Button>
                            </DeleteChat>
                        )}
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}
