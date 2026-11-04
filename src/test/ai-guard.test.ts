// src/test/ai-guard.test.ts
import { describe, it, expect } from 'vitest';
import { assertNoSacredContent, sanitizeTextForIndexing } from '../../netlify/functions/_shared/ai-guard';

describe('Sacred AI Guard (ADR-002 & Zero-Hallucination Covenant)', () => {
  it('passes payload without forbidden sacred fields', () => {
    const payload = {
      title_ar: 'مكتبة الصرف',
      tech_stack: ['TypeScript'],
      downloads_count: 500,
    };
    expect(() => assertNoSacredContent(payload)).not.toThrow();
  });

  it('throws strict guard error if sacred text fields are exposed to AI vectorizer', () => {
    const payload = {
      title_ar: 'تفسير معتمد',
      sacred_text: 'نص آية شريفة',
    };
    expect(() => assertNoSacredContent(payload)).toThrow(/RATQ_AI_GUARD/);
  });

  it('throws strict guard error if tafsir_body is exposed to AI vectorizer', () => {
    const payload = {
      title_ar: 'مرجع',
      tafsir_body: 'شرح تفسيري',
    };
    expect(() => assertNoSacredContent(payload)).toThrow(/RATQ_AI_GUARD/);
  });

  it('sanitizes placeholder markers for indexing', () => {
    const raw = 'وصف المكتبة [[AYAH_TEXT_FROM_APPROVED_SOURCE]] نهاية الوصف';
    const clean = sanitizeTextForIndexing(raw);
    expect(clean).toBe('وصف المكتبة  نهاية الوصف');
  });
});
