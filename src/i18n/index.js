import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  ar: { translation: ar },
};

const getInitialLanguage = () => {
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem('skillbridge-lang') : null;
  if (saved && ['fr', 'en', 'ar'].includes(saved)) {
    return saved;
  }
  return 'fr';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'skillbridge-lang',
      caches: ['localStorage'],
    },
  });

const applyDirection = (language) => {
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  if (typeof document !== 'undefined') {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }
};

applyDirection(i18n.language);

i18n.on('languageChanged', (language) => {
  applyDirection(language);
});

export default i18n;
