export const CLIENT_EVENTS = {
    SEND_MESSAGE: "send_message",
    GET_MESSAGE: "get_message",
    SEE_CHAT: "see_chat",
    SEND_TYPING: "send_typing",
} as const

export const SERVER_EVENTS = {
    NEW_MESSAGE: "new_message",
    MESSAGE_DELIVERED: "message_delivered",
    MESSAGE_DELETED: "message_deleted",
    CHAT_SEEN: "chat_seen",
    NEW_TYPING: "new_typing",
    USER_STATUS_CHANGED: "user_status_changed",
    NEW_MEMBERS: "new_members",
    ROLE_CHANGED: "role_changed",
    MEMBER_DELETED: "member_deleted",
    MEMBER_LEFT: "member_left",
    FRIEND_REQUEST: "friend_request",
    REQUEST_ACCEPTED: "request_accepted",
} as const

export const SOCKET_EVENTS = {
    ...CLIENT_EVENTS,
    ...SERVER_EVENTS,
} as const

type ServerEvents = typeof SERVER_EVENTS
export type ServerEvent = ServerEvents[keyof ServerEvents]

type ClientEvents = typeof CLIENT_EVENTS
export type ClientEvent = ClientEvents[keyof ClientEvents]
