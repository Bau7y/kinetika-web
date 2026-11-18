/**
 * schema.org JSON-LD builders. Pure functions: they receive data and return
 * plain objects, so pages decide what to publish and components stay unaware.
 */
import type { Lang } from '../i18n/routes';

type Json = Record<string, unknown>;

const absolute = (path: string, base: URL) => new URL(path, base).toString();

/** The business node every other object points to. */
export const businessRef = (base: URL) => ({ '@id': absolute('/#negocio', base) });

/** "Ley 7509" → schema.org Legislation; other labels are skipped. */
export function legislation(label?: string): Json | undefined {
  const number = label?.match(/^Ley (\d+)$/)?.[1];
  if (!number) return undefined;
  return {
    '@type': 'Legislation',
    name: label,
    legislationIdentifier: `Ley N.° ${number}`,
    legislationJurisdiction: 'CR',
  };
}

export interface ArticleInfo {
  title: string;
  description: string;
  path: string;
  /** Image path (the page's Open Graph image). */
  image?: string;
  updated: Date;
  law?: string;
}

/** A guide: an Article published by the business. */
export function articleSchema(base: URL, lang: Lang, info: ArticleInfo): Json {
  const law = legislation(info.law);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: info.title,
    description: info.description,
    url: absolute(info.path, base),
    mainEntityOfPage: absolute(info.path, base),
    ...(info.image ? { image: absolute(info.image, base) } : {}),
    inLanguage: lang,
    dateModified: info.updated.toISOString().slice(0, 10),
    author: businessRef(base),
    publisher: businessRef(base),
    ...(law ? { about: law } : {}),
  };
}

export function breadcrumbSchema(base: URL, items: { name: string; href: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.href, base),
    })),
  };
}
