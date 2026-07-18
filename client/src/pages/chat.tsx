import { ChatContext } from "@/features/chats/chat-context"
import DMChat from "@/features/chats/dm/components/dm-chat"
import { DMProvider } from "@/features/chats/dm/components/dm-provider"
import GroupChat from "@/features/chats/groups/components/group-chat"
import { GroupProvider } from "@/features/chats/groups/components/group-provider"
import { useChats } from "@/features/chats/queries"
import LoadingPage from "@/pages/loading"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Navigate, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function ChatPage() {
    const channelId = useParams().id
    const { t } = useTranslation("chats")

    if (!channelId) {
        throw new Error(
            "ChatProvider must be used within ChatPage in chats/:id route",
        )
    }
    const { data: chats, isLoading } = useChats()

    const chat = chats ? chats.find((c) => c.id === channelId) : undefined

    useEffect(() => {
        if (!isLoading && !chat) {
            const notif = t("errors.chatNotFound")
            toast.error(notif, {
                richColors: true,
            })
        }
    }, [chat, isLoading, t])

    if (isLoading) return <LoadingPage />

    if (!chat) {
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
