import GroupHeader from "@/features/chats/components/group-header"
import ChatFooter from "@/features/chats/components/chat-footer"
import ChatBody from "@/features/chats/components/chat-body"

export default function GroupChat() {
    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
            <GroupHeader />
            <ChatBody />
            <ChatFooter />
        </div>
    )
}
