import { getEntry } from 'astro:content';
import { getLocalized, type Localized } from './localized';
import { routes, type Lang } from '../i18n/routes';

export type LegalPage = Localized<'legal'>;

/** Privacy policy and legal notice; Spanish at the root, English under /en. */
export const getLegalPages = (lang: Lang) => getLocalized('legal', lang, routes.legalBase[lang]);

export async function getLegalHref(key: string, lang: Lang): Promise<string> {
  const page = (await getLegalPages(lang)).find((p) => p.key === key);
  if (!page) throw new Error(`Legal page "${key}" (${lang}) not found`);
  return page.href;
}

/** Version (date) of the Spanish privacy policy, recorded with each consent. */
export async function privacyVersion(): Promise<string> {
  const entry = await getEntry('legal', 'es/privacidad');
  return entry?.data.updated.toISOString().slice(0, 10) ?? 'sin fecha';
}
