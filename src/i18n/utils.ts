import { LOCALES, type Locale } from './copy';

/** Read the active locale from the URL path (en default at /, ar at /ar). */
export function getLocaleFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : 'en';
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en';
}

/** Home path for a locale: '/' for en, '/ar/' for ar. */
export function localeHome(locale: Locale): string {
  return locale === 'en' ? '/' : '/ar/';
}

/** Same single page in the other locale (used by the language toggle). */
export function otherLocalePath(locale: Locale): string {
  return localeHome(otherLocale(locale));
}

/** In-page anchor link (sections live on one page per locale). */
export function anchor(id: string): string {
  return `#${id}`;
}
