/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSocket } from "@/features/chats/hooks/use-socket"
import type { Args, ServerEvent } from "@bchat/shared/events"
import { useEffect, useLayoutEffect, useRef } from "react"

export function useSocketListener<T extends ServerEvent>(
    event: T,
    handler: (...args: Args<T>) => void,
) {
    const socket = useSocket()

    const handlerRef = useRef(handler)
    useLayoutEffect(() => {
        handlerRef.current = handler
    })

    useEffect(() => {
        if (!socket) return

        function stableHandler(...args: Args<T>) {
            handlerRef.current(...args)
        }

        socket.on(event, stableHandler as any)

        return () => {
            socket.off(event, stableHandler as any)
        }
    }, [socket, event])
}
