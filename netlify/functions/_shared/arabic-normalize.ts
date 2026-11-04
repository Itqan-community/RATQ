// netlify/functions/_shared/arabic-normalize.ts
// Pure TypeScript Arabic Normalization Utility for Search Matching ONLY.
// WARNING: NEVER APPLY TO SACRED QURANIC TEXT.

export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    // Remove Arabic diacritics (Harakat) and Tatweel (U+0640)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    // Normalize Alefs (أ, إ, آ, ٱ) -> ا
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Teh Marbuta (ة) -> ه
    .replace(/ة/g, 'ه')
    // Normalize Alef Maqsura (ى) -> ي
    .replace(/ى/g, 'ي')
    // Normalize Hamza forms (ؤ, ئ) -> و, ي
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
