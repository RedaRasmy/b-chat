import "i18next"
// import all namespaces (for the default language, only)
import common from "./en/common.json"
import auth from "./en/auth.json"
import friends from "./en/friends.json"
import profile from "./en/profile.json"
import chat from "./en/chats.json"

declare module "i18next" {
    // Extend CustomTypeOptions
    interface CustomTypeOptions {
        // custom namespace type, if you changed it
        defaultNS: "common"
        // custom resources type
        resources: {
            common: typeof common
            profile: typeof profile
            auth: typeof auth
            friends: typeof friends
            chat: typeof chat
        }
        // other
    }
}
