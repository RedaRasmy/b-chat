import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import { createMembers } from "@/features/chats/requests"
import { fetchFriends } from "@/features/friendships/requests"
import { cn } from "@/lib/utils"
import { type InsertMembersData } from "@bchat/shared/validation"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, type SyntheticEvent } from "react"

export function AddMembersForm({
    channelId,
    members,
}: {
    channelId: string
    members: string[]
}) {
    const [open, setOpen] = useState(false)
    const [ids, setIds] = useState<InsertMembersData>([])

    const { data: friends } = useQuery({
        queryKey: ["friends"],
        queryFn: fetchFriends,
    })

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createMembers,
        onSuccess: async () => {
            setOpen(false)
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        },
    })

    function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        mutation.mutate({
            channelId,
            data: ids,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button variant="outline" className={"w-full"} size={"lg"}>
                        <HugeiconsIcon icon={PlusSignIcon} />
                        Add Members
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={onSubmit} className="space-y-3">
                    <DialogHeader>
                        <DialogTitle>Add New Members</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        {friends ? (
                            <div className="grid gap-1 max-h-70 overflow-auto">
                                {friends.map((friend) => (
                                    <div
                                        key={friend.id}
                                        className={cn(
                                            "flex items-center p-2 border rounded-md gap-2",
                                            {
                                                "opacity-50": members.includes(
                                                    friend.id,
                                                ),
                                            },
                                        )}
                                    >
                                        <Checkbox
                                            checked={!!ids.includes(friend.id)}
                                            className={"cursor-pointer"}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setIds((prev) => [
                                                        ...prev,
                                                        friend.id,
                                                    ])
                                                } else {
                                                    setIds((prev) =>
                                                        prev.filter(
                                                            (id) =>
                                                                id !==
                                                                friend.id,
                                                        ),
                                                    )
                                                }
                                            }}
                                            disabled={members.includes(
                                                friend.id,
                                            )}
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
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        />
                        <Button type="submit" disabled={mutation.isPending}>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
