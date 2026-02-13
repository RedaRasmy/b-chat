import Avatar from "@/components/avatar"
import PageHeader from "@/components/page-header"
import { GroupSettings } from "@/features/chats/components/group-settings"
import type { GroupChat } from "@bchat/types"

export default function GroupHeader({ chat }: { chat: GroupChat }) {
    const { name, avatar, typingUser, id } = chat
    return (
        <PageHeader>
            <div className="flex items-center gap-2">
                <Avatar
                    data={{
                        id,
                        name,
                        avatar,
                    }}
                />
                <div className="flex flex-col -space-y-0.5">
                    <h1>{name}</h1>
                </div>
            </div>
            <div className="flex gap-2 items-center">
                {typingUser && (
                    <div className="text-xs text-muted-foreground">
                        <span>
                            <span className="text-primary">{typingUser}</span>{" "}
                            is
                        </span>{" "}
                        typing...
                    </div>
                )}

                <GroupSettings chat={chat} />
            </div>
        </PageHeader>
    )
}
