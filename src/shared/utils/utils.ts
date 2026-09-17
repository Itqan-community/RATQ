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

export function normalizeArabic(text: string): string {
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F]/g, '')  // strip tashkeel/diacritics
    .replace(/[أإآٱ]/g, 'ا')                        // alef variants → bare alef
    .replace(/ى/g, 'ي')                              // alef maqsura → yaa
    .replace(/ة/g, 'ه')                              // taa marbuta → haa
    .toLowerCase();
}

// Replaces {{placeholders}} in a template string with real values.
// Example: interpolate("Hello {{name}}", { name: "Sara" }) → "Hello Sara"
export function interpolate(
  template: string,
  params: Record<string, string | number>
): string {
  let result = template;

  for (const [key, value] of Object.entries(params)) {
    result = result.replaceAll(`{{${key}}}`, String(value));
  }

  return result;
}