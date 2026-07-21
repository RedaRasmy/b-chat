import type {
    Channel,
    ChatMessage,
    ChatSeenData,
    FriendRequestData,
    MessageAck,
    MessageDeletedData,
    MessageDeliveredData,
    NewTypingData,
    RequestAcceptedData,
    StatusChangedData,
} from "@bchat/types"
import {
    CLIENT_EVENTS,
    type ClientEvent,
    SERVER_EVENTS,
    type ServerEvent,
} from "./events"
import type {
    GetMessageData,
    MemberDeletedData,
    MemberLeftData,
    RoleChangedData,
    SeeChatData,
    SendMessageData,
    SendTypingData,
} from "../validation"

export * from "./events"

export type ServerToClientEvents = {
    [SERVER_EVENTS.NEW_MESSAGE]: (payload: ChatMessage) => void
    [SERVER_EVENTS.MESSAGE_DELETED]: (payload: MessageDeletedData) => void
    [SERVER_EVENTS.MESSAGE_DELIVERED]: (payload: MessageDeliveredData) => void
    [SERVER_EVENTS.CHAT_SEEN]: (payload: ChatSeenData) => void
    [SERVER_EVENTS.NEW_TYPING]: (payload: NewTypingData) => void
    [SERVER_EVENTS.USER_STATUS_CHANGED]: (payload: StatusChangedData) => void
    [SERVER_EVENTS.NEW_MEMBERS]: () => void
    [SERVER_EVENTS.ROLE_CHANGED]: (payload: RoleChangedData) => void
    [SERVER_EVENTS.MEMBER_DELETED]: (payload: MemberDeletedData) => void
    [SERVER_EVENTS.MEMBER_LEFT]: (payload: MemberLeftData) => void
    [SERVER_EVENTS.FRIEND_REQUEST]: (payload: FriendRequestData) => void
    [SERVER_EVENTS.REQUEST_ACCEPTED]: (payload: RequestAcceptedData) => void
    [SERVER_EVENTS.MISSING_MESSAGES]: (
        payload: Record<string, ChatMessage[]>,
    ) => void
    [SERVER_EVENTS.NEW_CHAT]: (payload: Channel) => void
}

export type ClientToServerEvents = {
    [CLIENT_EVENTS.SEND_MESSAGE]: (
        payload: SendMessageData,
        callback: (response: MessageAck) => void,
    ) => void

    [CLIENT_EVENTS.GET_MESSAGE]: (payload: GetMessageData) => void

    [CLIENT_EVENTS.SEE_CHAT]: (payload: SeeChatData) => void

    [CLIENT_EVENTS.SEND_TYPING]: (payload: SendTypingData) => void

    [CLIENT_EVENTS.SYNC_MESSAGES]: (payload: number) => void

    [CLIENT_EVENTS.JOIN_CHANNEL]: (payload: { channelId: string }) => void
}

// Utility Types

export type Args<E extends ServerEvent | ClientEvent> = E extends ServerEvent
    ? Parameters<ServerToClientEvents[E]>
    : E extends ClientEvent
      ? Parameters<ClientToServerEvents[E]>
      : never

export type Payload<E extends ServerEvent | ClientEvent> = E extends ServerEvent
    ? ServerToClientEvents[E] extends (arg: infer P, ...args: any[]) => any
        ? P
        : never
    : E extends ClientEvent
      ? ClientToServerEvents[E] extends (arg: infer P, ...args: any[]) => any
          ? P
          : never
      : never

export type Callback<E extends ServerEvent | ClientEvent> =
    E extends ServerEvent
        ? ServerToClientEvents[E] extends (...args: infer Args) => any
            ? Args extends [...any[], infer C]
                ? C extends (...args: any[]) => any
                    ? C
                    : never
                : never
            : never
        : E extends ClientEvent
          ? ClientToServerEvents[E] extends (...args: infer Args) => any
              ? Args extends [...any[], infer C]
                  ? C extends (...args: any[]) => any
                      ? C
                      : never
                  : never
              : never
          : never
