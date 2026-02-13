import { useUser } from "@/features/auth/use-user"
import Message from "@/features/chats/components/message"
import { useChat } from "@/features/chats/hooks/use-chat"
import { useChatMessages } from "@/features/chats/hooks/use-chat-messages"
import { useMessage } from "@/features/chats/hooks/use-message"

export default function ChatBody() {
    const user = useUser()
    const { members, chat } = useChat()
    const { messages, bottomRef } = useChatMessages(chat.id)
    const { retry, remove } = useMessage()

    return (
        <main className="p-3 space-y-2 overflow-y-auto relative">
            {messages.map((msg) => (
                <Message
                    onDelete={remove}
                    key={msg.id}
                    message={msg}
                    isUser={msg.senderId === user.id}
                    sender={members.get(msg.senderId)!}
                    onRetry={retry}
                />
            ))}
            <div ref={bottomRef} />
        </main>
    )
}
