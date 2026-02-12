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
import { cn } from "@/lib/utils"
import type { Chat } from "@bchat/types"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function ChatSettings({
    chat,
    chatName,
}: {
    chat: Chat
    chatName: string
}) {
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button variant="outline" size={"icon"}>
                        <HugeiconsIcon icon={MoreHorizontalIcon} size={60} />
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
                    <TabsContent value="settings">settings</TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}
