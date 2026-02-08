import { Channel } from "@bchat/database/tables"
import { OtherUser } from "./users"

export type Channels = {
    dms: {
        id: Channel["id"]
        friend: OtherUser
    }[]
}
