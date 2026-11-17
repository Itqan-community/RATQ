// src/lib/slug.ts
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Unicode-aware, matches payload-backend Resources.ts slugify (generateSlug above drops Arabic).
export const slugFromName = (name: string): string =>
  name.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
