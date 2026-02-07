import { DefaultEventsMap } from "socket.io"
import type { AccessTokenPayload } from "@/lib/jwt"

declare module "socket.io" {
    interface Socket {
        user: AccessTokenPayload
    }
}
