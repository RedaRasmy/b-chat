import { DefaultEventsMap } from "socket.io"
import type { AccessTokenPayload } from "@/lib/jwt"
import type { Profile } from "@bchat/types"

declare module "socket.io" {
    interface Socket {
        user: Profile
    }
}
