/**
 * Brand data in one place. Components read from here and never repeat it.
 * Translatable text lives in src/i18n/ui.ts.
 *
 * Optional values are published only when they have content. Do not fill
 * them with guesses: each one is a fact about the business.
 */
export const site = {
  name: 'Kinetika',
  /** Display name of the domain (OG images). The canonical URL is in astro.config.mjs. */
  domain: 'kinetikacr.com',
  locality: 'San Carlos',
  region: 'Alajuela',
  country: 'CR',
  /** Public contact email (contact page, privacy requests, footer, schema.org). */
  email: 'kinetikacr.sc@gmail.com' as string,
  /** International format, e.g. '+506 8888 8888'. Pending. */
  phone: '' as string,
  /** Public profiles (Google Business Profile, Facebook, Instagram…), used as `sameAs`. */
  profiles: [] as string[],
  /** Products already running on their own domain. */
  external: {
    tramimunisc: 'https://www.tramimunisc.com',
  },
} as const;
