// Picks the title/summary/description a resource shows for the site locale and the reading direction of that text.
// Port of live's localize-resource.ts. Payload has a single name/description (often English, e.g. Tanzil), so
// direction comes from the text actually shown, never from the page locale.
import type { Resource } from '@/types';

type Language = 'ar' | 'en';

export const languageDir = (lang?: Language): 'rtl' | 'ltr' | undefined => (lang === 'ar' ? 'rtl' : lang === 'en' ? 'ltr' : undefined);

const ARABIC_LETTER = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/g;
const LATIN_LETTER = /[A-Za-z]/g;

// Majority script; undefined when there are no letters to judge by.
export function detectLanguage(text?: string | null): Language | undefined {
  if (!text) return undefined;
  const ar = text.match(ARABIC_LETTER)?.length ?? 0;
  const en = text.match(LATIN_LETTER)?.length ?? 0;
  if (!ar && !en) return undefined;
  return ar > en ? 'ar' : 'en';
}

type Localizable = Pick<Resource, 'title_ar' | 'summary_ar' | 'description_ar'> &
  Partial<Pick<Resource, 'title_en' | 'summary_en' | 'description_en' | 'content_language'>>;

export function localizeResource(r: Localizable, locale: Language) {
  const en = locale === 'en';
  const title = (en && r.title_en) || r.title_ar;
  const summary = (en && r.summary_en) || r.summary_ar;
  const description = (en && r.description_en) || r.description_ar;
  return {
    title,
    summary,
    description,
    titleDir: languageDir(detectLanguage(title) ?? locale),
    descriptionDir: languageDir(detectLanguage(description) ?? r.content_language ?? locale),
  };
}
