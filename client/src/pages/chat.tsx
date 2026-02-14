import { ChatContext } from "@/features/chats/chat-context"
import DMChat from "@/features/chats/dm/components/dm-chat"
import { DMProvider } from "@/features/chats/dm/components/dm-provider"
import GroupChat from "@/features/chats/groups/components/group-chat"
import { GroupProvider } from "@/features/chats/groups/components/group-provider"
import { fetchChats } from "@/features/chats/requests"
import LoadingPage from "@/pages/loading"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function ChatPage() {
    const channelId = useParams().id

    if (!channelId) {
        throw new Error(
            "ChatProvider must be used within ChatPage in chats/:id route",
        )
    }
    const { data: chats, isLoading } = useQuery({
        queryKey: ["chats"],
        queryFn: fetchChats,
        staleTime: Infinity,
    })

    if (isLoading) return <LoadingPage />

    const chat = chats ? chats.find((c) => c.id === channelId) : undefined

    if (!chat) {
        toast.error("Chat not found!")
        return <Navigate to={"/"} />
    }

    const members = new Map(chat.members.map((m) => [m.id, m]))

    return (
        <ChatContext.Provider
            value={{
                chat,
                members,
            }}
        >
            {chat.type === "dm" ? (
                <DMProvider chat={chat}>
                    <DMChat />
                </DMProvider>
            ) : (
                <GroupProvider chat={chat} members={members}>
                    <GroupChat />
                </GroupProvider>
            )}
        </ChatContext.Provider>
    )
}
