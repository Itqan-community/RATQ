// netlify/functions/_shared/ai-guard.ts
// Strict Sacred Text Guard for AI Pipelines

const FORBIDDEN_FIELDS = [
  'quran_source_authority',
  'quran_source_url',
  'quran_source_version',
  'sacred_text',
  'tafsir_body',
  'translation_body',
  'contains_quranic_text',
];

export function assertNoSacredContent(payload: Record<string, unknown>): void {
  const leaks = Object.keys(payload).filter((key) => FORBIDDEN_FIELDS.includes(key));
  if (leaks.length > 0) {
    throw new Error(
      `RATQ_AI_GUARD: حقل محظور في الفهرسة الدلالية للذكاء الاصطناعي: ${leaks.join(', ')}`
    );
  }
}

export function sanitizeTextForIndexing(text: string): string {
  // Strips any potential sacred text delimiters or raw Quranic text blocks
  return text.replace(/\[\[AYAH_TEXT_.*?\]\]/g, '').trim();
}
