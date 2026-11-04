// netlify/functions/key-verify.ts
import { extractBearerToken, hashApiKey, timingSafeCompare } from './_shared/auth';
import { createErrorResponse } from './_shared/errors';
import { checkRateLimit } from './_shared/rate-limit';
import { getSupabaseAdmin } from './_shared/supabase-admin';

export async function handler(event: { headers: Record<string, string | undefined> }) {
  const token = extractBearerToken(event.headers.authorization || event.headers.Authorization);

  if (!token) {
    return createErrorResponse(
      401,
      'ERR_AUTH_MISSING_TOKEN',
      'مفتاح الـ API مفقود في الترويسة.',
      'API key is missing in Authorization header.'
    );
  }

  // Basic format check: ratq_<env>_<prefix>_<secret>
  const parts = token.split('_');
  if (parts.length < 4 || parts[0] !== 'ratq') {
    return createErrorResponse(
      400,
      'ERR_AUTH_INVALID_KEY_FORMAT',
      'صيغة مفتاح الـ API غير صالحة.',
      'Invalid API key format.'
    );
  }

  const prefix = parts[2];
  const pepper = process.env.KEY_PEPPER || 'default_dev_pepper_ratq_32_chars_ok';
  const computedHash = hashApiKey(token, pepper);

  // Rate limit check
  const rateLimit = checkRateLimit(prefix, 1000);
  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateLimit.resetSeconds),
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': '0',
      },
      body: JSON.stringify({
        error: {
          code: 'ERR_429',
          message_ar: `تجاوزت حد الطلبات المسموح. حاول بعد ${rateLimit.resetSeconds} ثانية.`,
          message_en: `Rate limit exceeded. Try again in ${rateLimit.resetSeconds} seconds.`,
        },
      }),
    };
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: keyRecord, error } = await supabase
      .from('api_keys')
      .select('id, resource_id, status, expires_at, scopes, key_hash')
      .eq('key_prefix', prefix)
      .eq('status', 'active')
      .single();

    if (error || !keyRecord) {
      return createErrorResponse(
        403,
        'ERR_AUTH_KEY_NOT_FOUND',
        'مفتاح الـ API غير صالح أو غير نشط.',
        'API key not found or inactive.'
      );
    }

    if (!timingSafeCompare(keyRecord.key_hash, computedHash)) {
      return createErrorResponse(
        403,
        'ERR_AUTH_KEY_INVALID',
        'مفتاح الـ API غير صالح.',
        'API key secret mismatch.'
      );
    }

    // Check expiration
    if (new Date(keyRecord.expires_at) < new Date()) {
      return createErrorResponse(
        403,
        'ERR_AUTH_KEY_EXPIRED',
        'انتهت صلاحية مفتاح الـ API.',
        'API key has expired.'
      );
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
      body: JSON.stringify({
        valid: true,
        key_id: keyRecord.id,
        resource_id: keyRecord.resource_id,
        scopes: keyRecord.scopes,
      }),
    };
  }

  // Demo fallback
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      valid: true,
      demo_mode: true,
      key_prefix: prefix,
      scopes: ['resources:read', 'resources:download'],
    }),
  };
}
