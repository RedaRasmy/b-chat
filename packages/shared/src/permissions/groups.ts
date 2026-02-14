import { Member } from "@bchat/database/tables"

export function canDeleteMessage(user: Member, sender: Member) {
    const isOwner = user.role === "owner"
    const isAdmin = user.role === "admin"
    const senderIsMember = sender.role === "member"
    return (
        user.userId === sender.userId || isOwner || (isAdmin && senderIsMember)
    )
}
