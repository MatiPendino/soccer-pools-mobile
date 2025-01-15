import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization';
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3', 
    resources: {
        en: { translation: en },
        es: { translation: es },
    },
    lng: getLocales()[0].languageTag, // Detect device language
    fallbackLng: 'en', 
    interpolation: {
        escapeValue: false, 
    },
})

export default i18n
