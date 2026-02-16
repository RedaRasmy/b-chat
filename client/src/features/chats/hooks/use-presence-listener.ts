import { useSocket } from "@/features/chats/use-socket"
import type { Channels, Friend, StatusChangeData } from "@bchat/types"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export default function usePresenceListener() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        function statusChangeHandler(data: StatusChangeData) {
            console.log("user-status changed : ", data)
            queryClient.setQueryData(["friends"], (old: Friend[] = []) => {
                return old.map((friend) => {
                    if (friend.id === data.userId) {
                        return {
                            ...friend,
                            status: data.status,
                            lastSeen: data.lastSeen,
                        }
                    } else {
                        return friend
                    }
                })
            })
            queryClient.setQueryData(["chats"], (old: Channels = []) =>
                old.map((chat) => {
                    if (chat.type === "group") return chat
                    const friend = chat.members.find(
                        (mem) => mem.id === data.userId,
                    )
                    if (!friend) return chat
                    return {
                        ...chat,
                        status: data.status,
                        lastSeen: data.lastSeen,
                    }
                }),
            )
        }

        socket.on("user_status_changed", statusChangeHandler)

        return () => {
            socket.off("user_status_changed", statusChangeHandler)
        }
    }, [socket, queryClient])
}
