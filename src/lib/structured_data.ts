/**
 * schema.org JSON-LD builders. Pure functions: they receive data and return
 * plain objects, so pages decide what to publish and components stay unaware.
 */
import type { Lang } from '../i18n/routes';
import { site } from '../data/site';
import { canton, districts } from '../data/service_area';

type Json = Record<string, unknown>;

const absolute = (path: string, base: URL) => new URL(path, base).toString();

/** The business node every other object points to. */
export const businessRef = (base: URL) => ({ '@id': absolute('/#negocio', base) });

const LANGUAGES = ['es', 'en'];

/** In person: the districts of San Carlos. Online: the whole country. */
export const areaServed = [
  ...districts.map((name) => ({
    '@type': 'Place',
    name: `${name}, ${canton.name}, ${canton.province}`,
  })),
  { '@type': 'Country', name: canton.country },
];

/** The business itself, published on the home page. Optional data only when it exists. */
export interface BusinessInfo {
  description: string;
  homePath: string;
  slogan: string;
  /** Topics the business works on (entity understanding for search and AI). */
  knowsAbout: string[];
  /** Products and services, with their page. */
  services: { name: string; path: string; description: string }[];
}

export function businessSchema(base: URL, lang: Lang, info: BusinessInfo): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    ...businessRef(base),
    name: site.name,
    description: info.description,
    slogan: info.slogan,
    url: absolute(info.homePath, base),
    // Raster logo: Google does not accept SVG logos
    logo: absolute('/logo.png', base),
    image: absolute('/og/index.png', base),
    knowsAbout: info.knowsAbout,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: site.name,
      itemListElement: info.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.description, url: absolute(s.path, base) },
      })),
    },
    inLanguage: lang,
    knowsLanguage: LANGUAGES,
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.profiles.length > 0 ? { sameAs: site.profiles } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed,
  };
}

/** The site itself, so assistants tie every page to one publisher and language set. */
export function websiteSchema(base: URL, lang: Lang, homePath: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absolute(homePath, base),
    inLanguage: lang,
    publisher: businessRef(base),
  };
}

export interface ServiceInfo {
  name: string;
  type: string;
  description: string;
  path: string;
  audience: string;
  /** Running on its own domain. */
  url?: string;
}

/** A product page: a Service provided by the business. */
export function serviceSchema(base: URL, lang: Lang, info: ServiceInfo): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: info.name,
    serviceType: info.type,
    description: info.description,
    url: absolute(info.path, base),
    ...(info.url ? { sameAs: info.url } : {}),
    inLanguage: lang,
    availableLanguage: LANGUAGES,
    provider: businessRef(base),
    areaServed,
    audience: { '@type': 'Audience', audienceType: info.audience },
  };
}

export interface FaqEntry {
  q: string;
  a: string;
}

/** FAQ markup no longer produces a Google rich result, but still describes the page. */
export function faqSchema(items: FaqEntry[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

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
  /** Primary sources cited by the article. */
  sources?: { title: string; url: string }[];
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
    ...(info.sources?.length ? { citation: info.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })) } : {}),
  };
}

/** Contact page, pointing at the business it belongs to. */
export function contactPageSchema(base: URL, lang: Lang, path: string, name: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    url: absolute(path, base),
    inLanguage: lang === 'es' ? 'es-CR' : 'en',
    about: businessRef(base),
  };
}

/** Ordered list of pages (projects index). */
export function itemListSchema(base: URL, items: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absolute(item.path, base),
    })),
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
