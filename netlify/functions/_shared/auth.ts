// netlify/functions/_shared/auth.ts
import crypto from 'crypto';

export function cryptoRandomString(bytesCount = 24): string {
  return crypto.randomBytes(bytesCount).toString('hex');
}

export function hashApiKey(fullKey: string, pepper: string): string {
  return crypto.createHmac('sha256', pepper).update(fullKey).digest('hex');
}

export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7).trim();
}
