import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

// En
import commonEn from "../../public/locales/en/common.json"
import authEn from "../../public/locales/en/auth.json"
import chatsEn from "../../public/locales/en/chats.json"
import postsEn from "../../public/locales/en/posts.json"
import profileEn from "../../public/locales/en/profile.json"
import friendsEn from "../../public/locales/en/friends.json"
// Fr
import commonFr from "../../public/locales/fr/common.json"
import authFr from "../../public/locales/fr/auth.json"
import chatsFr from "../../public/locales/fr/chats.json"
import postsFr from "../../public/locales/fr/posts.json"
import profileFr from "../../public/locales/fr/profile.json"
import friendsFr from "../../public/locales/fr/friends.json"

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true,

        interpolation: {
            escapeValue: false,
        },
        defaultNS: "common",

        ns: ["common"],

        resources: {
            en: {
                common: commonEn,
                auth: authEn,
                chats: chatsEn,
                posts: postsEn,
                profile: profileEn,
                friends: friendsEn,
            },
            fr: {
                common: commonFr,
                auth: authFr,
                chats: chatsFr,
                posts: postsFr,
                profile: profileFr,
                friends: friendsFr,
            },
        },

        supportedLngs: ["en", "fr"],
        cleanCode: true,

        // react i18next special options (optional)
        // override if needed - omit if ok with defaults
        /*
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      useSuspense: true,
    }
    */
    })

export default i18n
