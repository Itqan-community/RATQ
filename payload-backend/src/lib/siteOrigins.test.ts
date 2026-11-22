import { afterEach, describe, expect, it } from 'vitest'
import { corsOrigins, sessionCookieDomain } from './siteOrigins'

const env = process.env as Record<string, string | undefined>
const original = { NODE_ENV: env.NODE_ENV, COOKIE_DOMAIN: env.COOKIE_DOMAIN }

afterEach(() => {
  env.NODE_ENV = original.NODE_ENV
  if (original.COOKIE_DOMAIN === undefined) delete env.COOKIE_DOMAIN
  else env.COOKIE_DOMAIN = original.COOKIE_DOMAIN
})

describe('sessionCookieDomain', () => {
  it('sessionCookieDomain_productionWithoutEnv_defaultsToQuranTech', () => {
    env.NODE_ENV = 'production'
    delete env.COOKIE_DOMAIN
    expect(sessionCookieDomain()).toBe('.quran.tech')
  })

  it('sessionCookieDomain_productionWithEnv_usesEnvDomain', () => {
    env.NODE_ENV = 'production'
    env.COOKIE_DOMAIN = '.quran.tech'
    expect(sessionCookieDomain()).toBe('.quran.tech')
  })

  it('sessionCookieDomain_emptyEnv_fallsBackToQuranTech', () => {
    env.NODE_ENV = 'production'
    env.COOKIE_DOMAIN = ''
    expect(sessionCookieDomain()).toBe('.quran.tech')
  })

  it('sessionCookieDomain_development_isUndefinedEvenWithEnv', () => {
    env.NODE_ENV = 'development'
    env.COOKIE_DOMAIN = '.quran.tech'
    expect(sessionCookieDomain()).toBeUndefined()
  })
})

describe('corsOrigins', () => {
  it('corsOrigins_includesNewAndOldSiteHosts', () => {
    expect(corsOrigins).toEqual(
      expect.arrayContaining([
        'https://quran.tech',
        'https://beta.quran.tech',
        'https://ratq.itqan.dev',
        'https://beta.ratq.itqan.dev',
        'https://admin.ratq.itqan.dev',
      ]),
    )
  })
})
