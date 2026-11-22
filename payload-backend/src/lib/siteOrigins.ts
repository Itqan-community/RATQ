// COOKIE_DOMAIN overrides the default, so a lost env var cannot silently put the session
// cookie back on the retired .ratq.itqan.dev domain.
export const sessionCookieDomain = (): string | undefined =>
  process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN || '.quran.tech' : undefined

export const corsOrigins = [
  'https://quran.tech',
  'https://beta.quran.tech',
  'https://ratq.itqan.dev',
  'https://beta.ratq.itqan.dev',
  'https://admin.ratq.itqan.dev',
  'http://localhost:3000',
]
