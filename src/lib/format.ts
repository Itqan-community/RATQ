// src/lib/format.ts
// Date and Number formatting utilities

export function formatNumber(
  num: number,
  system: 'western' | 'arabic-indic' = 'western'
): string {
  if (system === 'arabic-indic') {
    return new Intl.NumberFormat('ar-SA-u-nu-arab').format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(
  dateString?: string,
  options?: { showHijri?: boolean; locale?: string }
): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Follows the site language (set on <html lang> by setLanguage); Arabic by default like live.
  const siteLang = typeof document !== 'undefined' ? document.documentElement.lang : 'ar';
  const locale = options?.locale || (siteLang === 'en' ? 'en-US' : 'ar-SA');

  const gregorian = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  if (options?.showHijri) {
    try {
      const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
      return `${hijri}هـ (${gregorian}م)`;
    } catch {
      return gregorian;
    }
  }

  return gregorian;
}

// Same folding as live's shared/utils normalizeArabic so catalog search matches across tashkeel, alef forms, ya and ta marbuta.
export function normalizeArabic(text: string): string {
  return text
    .replace(/[ؐ-ًؚ-ٟ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Sheet versions arrive as free text ("v4", "No updates"); only a leading digit takes the "v" prefix.
export const versionLabel = (v: string): string => (/^\d/.test(v) ? `v${v}` : v);

// Sheet languages are English names ("Urdu", "Turkish (tr)"). The platform's language names (Intl) supply the Arabic;
// ICU names a few differently from the sheet, so those map by hand. Anything unknown stays as written.
const SHEET_LANGUAGE_CODES: Record<string, string> = { bengali: 'bn', sinhalese: 'si', tagalog: 'tl', tajiki: 'tg', dari: 'prs', fulani: 'ff', ganda: 'lg' };
let codeByName: Map<string, string> | undefined;

export function languageName(name: string, en: boolean): string {
  if (en) return name;
  try {
    const display = new Intl.DisplayNames('ar', { type: 'language', fallback: 'none' });
    if (!codeByName) {
      const english = new Intl.DisplayNames('en', { type: 'language', fallback: 'none' });
      codeByName = new Map();
      for (const a of 'abcdefghijklmnopqrstuvwxyz') for (const b of 'abcdefghijklmnopqrstuvwxyz') {
        const n = english.of(a + b);
        if (n && n !== a + b) codeByName.set(n.toLowerCase(), a + b);
      }
    }
    const explicit = /\(([a-z]{2,3})\)$/.exec(name)?.[1];
    const first = name.replace(/\s*\(.*$/, '').trim().toLowerCase();
    const code = explicit ?? SHEET_LANGUAGE_CODES[first] ?? codeByName.get(first);
    return (code && display.of(code)) || name;
  } catch {
    return name;
  }
}
