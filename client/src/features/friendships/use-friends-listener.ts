import { useSocketListener } from "@/features/chats/hooks/use-socket-listener"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export default function useFriendsListener() {
    const queryClient = useQueryClient()
    const { t } = useTranslation("friends")

    useSocketListener("request_accepted", ({ userName }) => {
        queryClient.invalidateQueries({
            queryKey: ["friends"],
        })
        queryClient.invalidateQueries({
            queryKey: ["sent-requests"],
        })
        const notif = t("notifications.requestAccepted", { name: userName })
        toast.info(notif)
    })

    useSocketListener("friend_request", ({ userName }) => {
        queryClient.invalidateQueries({
            queryKey: ["requests"],
        })
        const notif = t("notifications.newRequest", { name: userName })
        toast.info(notif)
    })
}
