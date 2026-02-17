import {
    ChatMessage,
    MessageDeletedData,
    StatusChangedData,
    NewTypingData,
    MessageDeliveredData,
    ChatSeenData,
    FriendRequestData,
    RequestAcceptedData,
} from "@bchat/types"
import type { SERVER_EVENTS, CLIENT_EVENTS } from "./events"
import {
    GetMessageData,
    MemberDeletedData,
    MemberLeftData,
    RoleChangedData,
    SeeChatData,
    SendMessageData,
    SendTypingData,
} from "../validation"

export interface ClientPayloads {
    [CLIENT_EVENTS.SEND_MESSAGE]: SendMessageData
    [CLIENT_EVENTS.GET_MESSAGE]: GetMessageData
    [CLIENT_EVENTS.SEE_CHAT]: SeeChatData
    [CLIENT_EVENTS.SEND_TYPING]: SendTypingData
}

export interface ServerPayloads {
    [SERVER_EVENTS.NEW_MESSAGE]: ChatMessage
    [SERVER_EVENTS.MESSAGE_DELETED]: MessageDeletedData
    [SERVER_EVENTS.MESSAGE_DELIVERED]: MessageDeliveredData
    [SERVER_EVENTS.CHAT_SEEN]: ChatSeenData
    [SERVER_EVENTS.NEW_TYPING]: NewTypingData
    [SERVER_EVENTS.USER_STATUS_CHANGED]: StatusChangedData
    [SERVER_EVENTS.NEW_MEMBERS]: null
    [SERVER_EVENTS.ROLE_CHANGED]: RoleChangedData
    [SERVER_EVENTS.MEMBER_DELETED]: MemberDeletedData
    [SERVER_EVENTS.MEMBER_LEFT]: MemberLeftData
    [SERVER_EVENTS.FRIEND_REQUEST]: FriendRequestData
    [SERVER_EVENTS.REQUEST_ACCEPTED]: RequestAcceptedData
}

// function ClientEmitter<T extends ClientEvent>(
//     name: T,
//     payload: ClientPayloads[T],
// ) {}
// function ServerEmitter<T extends ServerEvent>(
//     name: T,
//     payload: ServerPayloads[T],
// ) {}

// ServerEmitter("chat_seen", {})
