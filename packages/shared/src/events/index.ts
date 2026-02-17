import { MessageAck } from "@bchat/types"
import { CLIENT_EVENTS } from "./events"
import { ClientPayloads, ServerPayloads } from "./payloads"

export * from "./events"
export * from "./payloads"

export type ServerToClientEvents = {
    [K in keyof ServerPayloads]: (payload: ServerPayloads[K]) => void
}

export interface ClientToServerEvents {
    [CLIENT_EVENTS.SEND_MESSAGE]: (
        payload: ClientPayloads[typeof CLIENT_EVENTS.SEND_MESSAGE],
        callback: (response: MessageAck) => void,
    ) => void

    [CLIENT_EVENTS.GET_MESSAGE]: (
        payload: ClientPayloads[typeof CLIENT_EVENTS.GET_MESSAGE],
    ) => void

    [CLIENT_EVENTS.SEE_CHAT]: (
        payload: ClientPayloads[typeof CLIENT_EVENTS.SEE_CHAT],
    ) => void

    [CLIENT_EVENTS.SEND_TYPING]: (
        payload: ClientPayloads[typeof CLIENT_EVENTS.SEND_TYPING],
    ) => void
}
