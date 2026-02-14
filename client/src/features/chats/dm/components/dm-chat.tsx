import DMHeader from "@/features/chats/dm/components/dm-header"
import ChatFooter from "@/features/chats/components/chat-footer"
import DMBody from "@/features/chats/dm/components/dm-body"

export default function DMChat() {
    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
            <DMHeader />
            <DMBody />
            <ChatFooter />
        </div>
    )
}
