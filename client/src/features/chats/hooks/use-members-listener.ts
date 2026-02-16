import { useSocket } from "@/features/chats/use-socket"
import type { Member } from "@bchat/types"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export default function useMembersListener() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        function handleNewMembers() {
            console.log("new members")
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }
        function handleMemberLeft(data: { userId: string; userName: string }) {
            console.log("member left : ", data)
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }
        function handleMemberDeleted(data: {
            userId: string
            userName: string
        }) {
            console.log("member deleted : ", data)
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }
        function handleRoleChanged(data: {
            userId: string
            userName: string
            oldRole: Member["role"]
            newRole: Member["role"]
        }) {
            console.log("role changed : ", data)
            queryClient.invalidateQueries({
                queryKey: ["chats"],
            })
        }

        socket.on("role_changed", handleRoleChanged)
        socket.on("member_left", handleMemberLeft)
        socket.on("member_deleted", handleMemberDeleted)
        socket.on("new_members", handleNewMembers)

        return () => {
            socket.off("role_changed", handleRoleChanged)
            socket.off("member_left", handleMemberLeft)
            socket.off("member_deleted", handleMemberDeleted)
            socket.off("new_members", handleNewMembers)
        }
    }, [socket, queryClient])
}
