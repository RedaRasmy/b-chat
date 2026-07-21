import { TypedSocket } from "@/socket"
import { Profile } from "@bchat/types"

type Channels =
    | string[]
    | {
          channelId: string
      }[]

export function buildHandler(
    onEvent: (
        user: Profile,
        {
            socket,
            joinChannel,
            joinSelf,
            joinChannels,
            joinUsers,
        }: {
            socket: TypedSocket
            joinChannel: (channelId: string) => void
            joinSelf: () => void
            joinChannels: (channels: Channels) => void
            joinUsers: (ids: string | string[]) => void
        },
    ) => Promise<void> | void,
) {
    return async (socket: TypedSocket) => {
        await onEvent(socket.data.user, {
            socket,
            joinChannel: (id) => {
                socket.join(`channel:${id}`)
            },
            joinSelf: () => {
                socket.join(`user:${socket.data.user.id}`)
            },
            joinChannels: (channels) => {
                if (channels.length === 0) return

                channels.forEach((unkown) => {
                    if (typeof unkown === "string") {
                        socket.join(`channel:${unkown}`)
                    } else {
                        const id = unkown.channelId
                        socket.join(`channel:${id}`)
                    }
                })
            },
            joinUsers: (ids) => {
                if (typeof ids === "string") {
                    socket.join(`user:${ids}`)
                } else {
                    ids.forEach((id) => {
                        socket.join(`user:${id}`)
                    })
                }
            },
        })
    }
}
