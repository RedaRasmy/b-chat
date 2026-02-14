import GroupHeader from "@/features/chats/groups/components/group-header"
import ChatFooter from "@/features/chats/components/chat-footer"
import GroupBody from "@/features/chats/groups/components/group-body"

export default function GroupChat() {
    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
            <GroupHeader />
            <GroupBody />
            <ChatFooter />
        </div>
    )
}
