import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ko from './assets/locales/ko.json';

const resources = {
    ko: {
        translation: ko,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ko', // default language
        fallbackLng: 'ko',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
