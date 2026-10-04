import type { Resource } from '@/types/resource';

type Language = 'ar' | 'en';

export const languageDir = (lang?: Language) => (lang === 'ar' ? 'rtl' : lang === 'en' ? 'ltr' : undefined);

const ARABIC_LETTER = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const LATIN_LETTER = /[A-Za-z]/g;

// Majority script of a text, for sources (CMS, Payload) that carry no explicit
// language field. Undefined when there are no letters to judge by.
export function detectLanguage(text?: string | null): Language | undefined {
  if (!text) return undefined;
  const ar = text.match(ARABIC_LETTER)?.length ?? 0;
  const en = text.match(LATIN_LETTER)?.length ?? 0;
  if (!ar && !en) return undefined;
  return ar > en ? 'ar' : 'en';
}

// Picks the Arabic or base text of a resource for the site locale and reports
// which language ended up on screen, so callers set the reading direction from
// the text actually shown. Resources with no Arabic fields pass through with
// their own content/title language.
export function localizeResource(resource: Resource, locale: Language) {
  const wantsArabic = locale === 'ar';
  const nameAr = wantsArabic ? resource.name_ar : undefined;
  const descriptionAr = wantsArabic ? resource.description_ar : undefined;

  return {
    name: nameAr || resource.name,
    description: descriptionAr || resource.description,
    shortDescription: descriptionAr || resource.short_description || resource.description,
    publisherName: (wantsArabic && resource.publisher?.name_ar) || resource.publisher?.name,
    titleLanguage: nameAr ? (detectLanguage(nameAr) ?? 'ar') : resource.title_language,
    contentLanguage: descriptionAr ? (detectLanguage(descriptionAr) ?? 'ar') : resource.content_language,
  };
}
