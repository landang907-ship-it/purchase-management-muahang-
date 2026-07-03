import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './vi';
import zh from './zh';

export type Lang = 'VI' | 'ZH';

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

/**
 * Custom translation function.
 * @param key   - translation key
 * @param lang  - 'VI' | 'ZH'
 * @param params - optional interpolation params
 */
export const t = (
  key: string,
  lang: Lang,
  params?: Record<string, string | number>
): string => {
  return i18n.t(key, { lng: lang.toLowerCase(), ...(params ?? {}) });
};

export default i18n;
﻿