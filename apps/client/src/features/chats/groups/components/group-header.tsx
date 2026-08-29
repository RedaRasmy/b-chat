import Avatar from "@/components/avatar"
import PageHeader from "@/components/page-header"
import { GroupSettings } from "@/features/chats/groups/components/group-settings"
import { useGroup } from "@/features/chats/groups/use-group"
import { Trans } from "react-i18next"

export default function GroupHeader() {
    const { chat } = useGroup()
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
                        <Trans
                            ns="chats"
                            i18nKey="styledUserIsTyping"
                            values={{ name: typingUser }}
                            components={[<span className="text-primary" />]}
                        />
                    </div>
                )}
                <GroupSettings />
            </div>
        </PageHeader>
    )
}
