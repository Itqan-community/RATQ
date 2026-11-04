// src/lib/security.ts
// Security sanitization and key masking utilities

export function maskApiKey(prefix: string): string {
  return `ratq_live_${prefix}_••••••••••••••••••••••••`;
}

export function sanitizeHtml(raw: string): string {
  // Strip dangerous HTML tags
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '');
}
