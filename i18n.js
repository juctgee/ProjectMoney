import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      Currency: 'Currency',
      Language: 'Language',
      Theme: 'Theme',
      Security: 'Security',
      Notification: 'Notification',
      Select: 'Select',
      Close: 'Close',
    },
  },
  es: {
    translation: {
      Currency: 'Moneda',
      Language: 'Idioma',
      Theme: 'Tema',
      Security: 'Seguridad',
      Notification: 'Notificación',
      Select: 'Seleccionar',
      Close: 'Cerrar',
    },
  },
  fr: {
    translation: {
      Currency: 'Devise',
      Language: 'Langue',
      Theme: 'Thème',
      Security: 'Sécurité',
      Notification: 'Notification',
      Select: 'Sélectionner',
      Close: 'Fermer',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // ตั้งค่าภาษาเริ่มต้น
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
