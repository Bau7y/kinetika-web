import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { joinPath, type Lang } from '../i18n/routes';

/**
 * Collections stored as src/content/<collection>/<lang>/<key>.md.
 * <key> (the Spanish file name) pairs the translations of one entry.
 */
export type Localized<C extends CollectionKey> = CollectionEntry<C> & { key: string; lang: Lang; href: string };

const keyOf = (id: string) => id.split('/')[1];
const langOf = (id: string) => id.split('/')[0] as Lang;

type WithSlug = { data: { url_slug: string; order: number } };

/** Entries of one language, sorted by `order`, with key and localized href (`<base>/<url_slug>`). */
export async function getLocalized<C extends CollectionKey>(collection: C, lang: Lang, base: string): Promise<Localized<C>[]> {
  const entries = (await getCollection(collection, ({ id }) => langOf(id) === lang)) as (CollectionEntry<C> & WithSlug)[];
  return entries
    .map((entry) => ({ ...entry, key: keyOf(entry.id), lang, href: joinPath(base, entry.data.url_slug) }))
    .sort((a, b) => a.data.order - b.data.order);
}
