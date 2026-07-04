import { Button } from "@/components/ui/button"
import { useSocket } from "@/features/chats/hooks/use-socket"
import { useEffect, useState } from "react"

/**
 * For testing and debugging purposes
 */
export default function ConnectionButton() {
    const socket = useSocket()
    const [_, refrech] = useState(0)

    function handleToggle() {
        if (socket.connected) {
            socket.disconnect()
        } else {
            socket.connect()
        }
    }

    useEffect(() => {
        function handleConnect() {
            refrech(1)
        }
        function handleDisconnect() {
            refrech(2)
        }

        socket.on("connect", handleConnect)
        socket.on("disconnect", handleDisconnect)

        return () => {
            socket.off("connect", handleConnect)
            socket.off("disconnect", handleDisconnect)
        }
    }, [socket])

    if (import.meta.env.PROD) {
        return null
    }

    return (
        <Button
            onClick={handleToggle}
            variant={socket.connected ? "destructive" : "default"}
        >
            {socket.connected ? "Disconnect" : "Connect"}
        </Button>
    )
}
