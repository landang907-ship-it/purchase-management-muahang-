import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './vi';
import zh from './zh';

const resources = {
  vi: { translation: vi },
  zh: { translation: zh },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi',
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
﻿