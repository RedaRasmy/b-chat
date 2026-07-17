import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"

i18n.use(LanguageDetector)
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react!!
        },
        defaultNS: "common",

        ns: ["common"],

        backend: {
            // Path to your JSON files
            loadPath: "/locales/{{lng}}/{{ns}}.json",
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
