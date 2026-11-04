// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonAr from './locales/ar/common.json';
import navAr from './locales/ar/nav.json';
import catalogAr from './locales/ar/catalog.json';
import resourceAr from './locales/ar/resource.json';
import appAr from './locales/ar/app.json';
import publisherAr from './locales/ar/publisher.json';
import reviewAr from './locales/ar/review.json';
import moderationAr from './locales/ar/moderation.json';
import adminAr from './locales/ar/admin.json';
import authAr from './locales/ar/auth.json';
import legalAr from './locales/ar/legal.json';
import errorsAr from './locales/ar/errors.json';

import commonEn from './locales/en/common.json';
import navEn from './locales/en/nav.json';
import catalogEn from './locales/en/catalog.json';
import resourceEn from './locales/en/resource.json';
import appEn from './locales/en/app.json';
import publisherEn from './locales/en/publisher.json';
import reviewEn from './locales/en/review.json';
import moderationEn from './locales/en/moderation.json';
import adminEn from './locales/en/admin.json';
import authEn from './locales/en/auth.json';
import legalEn from './locales/en/legal.json';
import errorsEn from './locales/en/errors.json';

export const resources = {
  ar: {
    common: commonAr,
    nav: navAr,
    catalog: catalogAr,
    resource: resourceAr,
    app: appAr,
    publisher: publisherAr,
    review: reviewAr,
    moderation: moderationAr,
    admin: adminAr,
    auth: authAr,
    legal: legalAr,
    errors: errorsAr,
  },
  en: {
    common: commonEn,
    nav: navEn,
    catalog: catalogEn,
    resource: resourceEn,
    app: appEn,
    publisher: publisherEn,
    review: reviewEn,
    moderation: moderationEn,
    admin: adminEn,
    auth: authEn,
    legal: legalEn,
    errors: errorsEn,
  },
};

const savedLocale =
  typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function'
    ? (window.localStorage.getItem('ratq_locale') as 'ar' | 'en') || 'ar'
    : 'ar';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLocale,
  fallbackLng: 'ar',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export function setLanguage(lang: 'ar' | 'en') {
  i18n.changeLanguage(lang);
  localStorage.setItem('ratq_locale', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

// Initial sync
document.documentElement.lang = savedLocale;
document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';

export default i18n;
