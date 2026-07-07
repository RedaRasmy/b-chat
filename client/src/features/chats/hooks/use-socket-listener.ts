/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSocket } from "@/features/chats/hooks/use-socket"
import type { Args, ServerEvent } from "@bchat/shared/events"
import { useEffect, useEffectEvent } from "react"

export function useSocketListener<T extends ServerEvent>(
    event: T,
    handler: (...args: Args<T>) => void,
) {
    const socket = useSocket()

    const onEvent = useEffectEvent((...args: Args<T>) => {
        handler(...args)
    })

    useEffect(() => {
        if (!socket) return

        socket.on(event, onEvent as any)

        return () => {
            socket.off(event, onEvent as any)
        }
    }, [socket, event])
}
