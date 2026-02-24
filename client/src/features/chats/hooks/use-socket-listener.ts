/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSocket } from "@/features/chats/hooks/use-socket"
import type { ServerEvent, ServerPayloads } from "@bchat/shared/events"
import { useEffect, useLayoutEffect, useRef } from "react"

export function useSocketListener<T extends ServerEvent>(
    event: T,
    handler: (data: ServerPayloads[T]) => void,
) {
    const socket = useSocket()

    const handlerRef = useRef(handler)
    useLayoutEffect(() => {
        handlerRef.current = handler
    })

    useEffect(() => {
        if (!socket) return

        function stableHandler(data: ServerPayloads[T]) {
            handlerRef.current(data)
        }

        socket.on(event, stableHandler as any)

        return () => {
            socket.off(event, stableHandler as any)
        }
    }, [socket, event])
}
