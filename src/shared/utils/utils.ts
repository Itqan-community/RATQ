/** Format an ISO date string to a readable date in the given locale */
export function formatDate(dateString: string, locale: 'ar' | 'en' = 'ar'): string {
  const date = new Date(dateString);
  if (!dateString || Number.isNaN(date.getTime())) return '—';
  const localeMap = { ar: 'ar-EG', en: 'en-US' };
  return date.toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
