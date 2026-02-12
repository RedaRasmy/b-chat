import { ActionButton } from "@/components/action-button"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserCard from "@/components/user-card"
import { useAuth } from "@/features/auth/use-auth"
import { deleteChat } from "@/features/chats/requests"
import { cn } from "@/lib/utils"
import type { Chat } from "@bchat/types"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

export function ChatSettings({
    chat,
    chatName,
}: {
    chat: Chat
    chatName: string
}) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { user } = useAuth()

    const isDM = chat.type === "dm"
    const isOwner = user
        ? !!chat.members.find(
              (mem) => mem.id === user.id && mem.chatRole === "owner",
          )
        : false

    const deleteMutation = useMutation({
        mutationFn: deleteChat,
        onSuccess: () => {
            navigate("/")
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        },
    })

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
                    <SheetTitle className={"text-xl"}>{chatName}</SheetTitle>
                    {/* <SheetDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                    </SheetDescription> */}
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
                        {chat.members.map((member) => (
                            <UserCard key={member.id} user={member}>
                                <span
                                    className={cn("text-muted-foreground", {
                                        "text-green-600":
                                            member.chatRole === "admin",
                                        "text-yellow-500":
                                            member.chatRole === "owner",
                                    })}
                                >
                                    {member.chatRole}
                                </span>
                            </UserCard>
                        ))}
                    </TabsContent>
                    <TabsContent value="settings">
                        {(isDM || isOwner) && (
                            <ActionButton
                                action={() => deleteMutation.mutate(chat.id)}
                                requireAreYouSure
                                triggerElement={
                                    <Button
                                        variant={"destructive"}
                                        className={"w-full my-1 py-4"}
                                    >
                                        Delete Chat
                                    </Button>
                                }
                            ></ActionButton>
                        )}
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}
