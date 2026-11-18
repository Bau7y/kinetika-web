/**
 * Localized routes. Spanish is the default language and has no prefix;
 * English lives under /en with translated segments. Entries of the content
 * collections (work, guides, legal) build their own paths from these bases.
 */
export const languages = { es: 'Español', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const DEFAULT_LANG: Lang = 'es';
export const LANGS = Object.keys(languages) as Lang[];

export const routes = {
  home: { es: '/', en: '/en' },
  quote: { es: '/cotizar', en: '/en/quote' },
  servicesBase: { es: '/servicios', en: '/en/services' },
  projectsBase: { es: '/proyectos', en: '/en/projects' },
  guides: { es: '/guias', en: '/en/guides' },
  legalBase: { es: '', en: '/en' },
} as const satisfies Record<string, Record<Lang, string>>;

/** Language of a URL: the first segment when it is a known prefix, Spanish otherwise. */
export function getLang(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : DEFAULT_LANG;
}

/** Joins a localized base and a slug without double slashes ('' + 'privacidad' → '/privacidad'). */
export const joinPath = (base: string, slug: string) => `${base}/${slug}`.replace(/\/{2,}/g, '/');

/** Anchor on the home page of a language: ('es', 'contacto') → '/#contacto', ('en', …) → '/en#contacto'. */
export function homeAnchor(lang: Lang, id: string): string {
  const home = routes.home[lang];
  return home === '/' ? `/#${id}` : `${home}#${id}`;
}
