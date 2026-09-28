import type { Resource } from '@/types/resource';

type Language = 'ar' | 'en';

export const languageDir = (lang?: Language) => (lang === 'ar' ? 'rtl' : lang === 'en' ? 'ltr' : undefined);

// Picks the Arabic or base text of a resource for the site locale and reports
// which language ended up on screen, so callers set the reading direction from
// the text actually shown - never from sniffing it (issue #303). Resources with
// no Arabic fields pass through with their own content/title language.
export function localizeResource(resource: Resource, locale: Language) {
  const wantsArabic = locale === 'ar';
  const nameAr = wantsArabic ? resource.name_ar : undefined;
  const descriptionAr = wantsArabic ? resource.description_ar : undefined;

  return {
    name: nameAr || resource.name,
    description: descriptionAr || resource.description,
    shortDescription: descriptionAr || resource.short_description || resource.description,
    publisherName: (wantsArabic && resource.publisher?.name_ar) || resource.publisher?.name,
    titleLanguage: nameAr ? ('ar' as const) : resource.title_language,
    contentLanguage: descriptionAr ? ('ar' as const) : resource.content_language,
  };
}
