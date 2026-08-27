import { useUser } from "@/features/auth/use-user"
import DMMessage from "@/features/chats/dm/components/dm-message"
import { useChat } from "@/features/chats/hooks/use-chat"
import { useChatMessages } from "@/features/chats/hooks/use-chat-messages"
import { useMessage } from "@/features/chats/hooks/use-message"

export default function DMBody() {
    const user = useUser()
    const { members, chat } = useChat()
    const { messages, bottomRef } = useChatMessages(chat.id)
    const { retry, remove } = useMessage()

    return (
        <main
            aria-label="Chat body"
            className="p-3 space-y-2 overflow-y-auto relative"
        >
            {messages.map((msg) => (
                <DMMessage
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
