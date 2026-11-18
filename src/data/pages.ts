/**
 * Registry of every indexable page in both languages: the single source of
 * truth for the sitemap, hreflang, the Open Graph images and llms.txt.
 * Pages built from content collections are added from their own loaders, so
 * a new service, project or guide only needs its Markdown file.
 */
import { LANGS, routes, type Lang } from '../i18n/routes';
import { useTranslations } from '../i18n/ui';
import { getWork } from './work';
import { getGuides } from './guides';
import { getLegalPages } from './legal';

export type PageSection = 'home' | 'quote' | 'service' | 'projects' | 'project' | 'guides' | 'guide' | 'legal';

export interface PageEntry {
  path: string;
  lang: Lang;
  section: PageSection;
  /** Visible heading, used on the Open Graph image. */
  title: string;
  description: string;
  /** Same page in each language (hreflang). */
  alternates: Record<Lang, string>;
  /** Last content review: sitemap lastmod. */
  updated?: Date;
}

/** Pairs entries of a localized collection by key: (key, lang) → { es: href, en: href }. */
export function pairHrefs(lists: Record<Lang, { key: string; href: string }[]>) {
  const pairs = new Map<string, Partial<Record<Lang, string>>>();
  for (const lang of LANGS) {
    for (const { key, href } of lists[lang]) pairs.set(key, { ...pairs.get(key), [lang]: href });
  }
  return (key: string, lang: Lang) => {
    const pair = pairs.get(key) ?? {};
    return Object.fromEntries(LANGS.map((l) => [l, pair[l] ?? pair[lang]])) as Record<Lang, string>;
  };
}

/** Pages with a fixed route in both languages. */
function fixedPages(lang: Lang): PageEntry[] {
  const t = useTranslations(lang);
  const fixed = (section: PageSection, route: Record<Lang, string>, title: string, description: string): PageEntry => ({
    path: route[lang],
    lang,
    section,
    title,
    description,
    alternates: route,
  });
  return [
    fixed('home', routes.home, t('site.tagline'), t('site.description')),
    fixed('quote', routes.quote, t('quote.page_title'), t('quote.meta')),
    fixed('projects', routes.projectsBase, t('projects.title'), t('projects.meta')),
    fixed('guides', routes.guides, t('guides.title'), t('guides.meta')),
  ];
}

export async function getPages(): Promise<PageEntry[]> {
  const work = { es: await getWork('es'), en: await getWork('en') };
  const workAlt = pairHrefs(work);
  const guides = { es: await getGuides('es'), en: await getGuides('en') };
  const guideAlt = pairHrefs(guides);
  const legal = { es: await getLegalPages('es'), en: await getLegalPages('en') };
  const legalAlt = pairHrefs(legal);

  return LANGS.flatMap((lang) => [
    ...fixedPages(lang),
    ...work[lang].map(
      (w): PageEntry => ({
        path: w.href,
        lang,
        section: w.data.kind,
        title: w.data.title,
        description: w.data.meta_description,
        alternates: workAlt(w.key, lang),
        updated: w.data.updated,
      }),
    ),
    ...guides[lang].map(
      (g): PageEntry => ({
        path: g.href,
        lang,
        section: 'guide',
        title: g.data.title,
        description: g.data.meta_description,
        alternates: guideAlt(g.key, lang),
        updated: g.data.updated,
      }),
    ),
    ...legal[lang].map(
      (l): PageEntry => ({
        path: l.href,
        lang,
        section: 'legal',
        title: l.data.title,
        description: l.data.meta_description,
        alternates: legalAlt(l.key, lang),
        updated: l.data.updated,
      }),
    ),
  ]);
}

/** Open Graph image size. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Path of a page's Open Graph image: /og/<page path>.png ("/" becomes /og/index.png). */
export const ogImagePath = (path: string) => `/og${path === '/' ? '/index' : path}.png`;
