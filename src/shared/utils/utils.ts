/** Parse a `page` query param into a valid 1-indexed page number, falling back to 1 for missing/invalid/non-positive values */
export function parsePageParam(value: string | null): number {
  const parsed = parseInt(value ?? '1', 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

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

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;
export function validatePassword(password: string): boolean {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return false;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return false;
  }
  return true;
}
