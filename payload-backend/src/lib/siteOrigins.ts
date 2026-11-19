// Cookie domain is env-driven so the droplet can move from .ratq.itqan.dev to .quran.tech
// by changing COOKIE_DOMAIN and restarting. Unset keeps the legacy value.
export const sessionCookieDomain = (): string | undefined =>
  process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN || '.ratq.itqan.dev' : undefined

export const corsOrigins = [
  'https://quran.tech',
  'https://beta.quran.tech',
  'https://ratq.itqan.dev',
  'https://beta.ratq.itqan.dev',
  'https://admin.ratq.itqan.dev',
  'http://localhost:3000',
]
