import DMHeader from "@/features/chats/components/dm-header"
import ChatFooter from "@/features/chats/components/chat-footer"
import ChatBody from "@/features/chats/components/chat-body"

export default function DMChat() {
    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
            <DMHeader />
            <ChatBody />
            <ChatFooter />
        </div>
    )
}
