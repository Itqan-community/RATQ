// netlify/functions/_shared/rate-limit.ts

interface RateBucket {
  tokens: number;
  lastRefill: number;
}

const memoryStore = new Map<string, RateBucket>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  limitPerHour = 1000
): RateLimitResult {
  const now = Date.now();
  const windowMs = 3600 * 1000;
  let bucket = memoryStore.get(identifier);

  if (!bucket) {
    bucket = { tokens: limitPerHour, lastRefill: now };
    memoryStore.set(identifier, bucket);
  }

  // Refill tokens proportionally
  const timePassed = now - bucket.lastRefill;
  if (timePassed > windowMs) {
    bucket.tokens = limitPerHour;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      limit: limitPerHour,
      remaining: bucket.tokens,
      resetSeconds: Math.ceil((windowMs - (now - bucket.lastRefill)) / 1000),
    };
  }

  return {
    allowed: false,
    limit: limitPerHour,
    remaining: 0,
    resetSeconds: Math.ceil((windowMs - (now - bucket.lastRefill)) / 1000),
  };
}
