import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PRODUCT_STATUSES } from './data/product_status';

/**
 * Collections stored as src/content/<collection>/<lang>/<key>.md.
 * <key> (the Spanish file name) pairs both translations. `url_slug` is the
 * URL segment for that language (`slug` is reserved by the glob loader).
 */
const slug = z.string().regex(/^[a-z0-9-]+$/);

/** One page per product: what it does, a working demo and how it is delivered. */
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    order: z.number().int(),
    url_slug: slug,
    status: z.enum(PRODUCT_STATUSES),
    /** Short name (menus, cards). */
    name: z.string(),
    /** Visible h1. */
    title: z.string(),
    /** <title> for search results. Include the service and the place. */
    seo_title: z.string(),
    meta_description: z.string().max(160),
    summary: z.string(),
    /** Kind of service for schema.org (e.g. "Desarrollo web"). */
    service_type: z.string(),
    audience: z.string(),
    /** Product already running on its own domain. */
    external_url: z.url().optional(),
    /** Last content review; shown on the page and used as sitemap lastmod. */
    updated: z.coerce.date(),
    demo: z.object({
      title: z.string(),
      text: z.string(),
    }),
    highlights: z.object({
      title: z.string(),
      items: z.array(z.object({ title: z.string(), text: z.string() })).min(2),
    }),
    steps: z.object({
      title: z.string(),
      items: z.array(z.object({ title: z.string(), text: z.string() })).min(2),
    }),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    cta: z.object({
      title: z.string(),
      text: z.string(),
    }),
  }),
});

/**
 * Practical guides: they answer one question in depth and link to the
 * product that solves it (`product` key).
 */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    order: z.number().int(),
    url_slug: slug,
    /** Short label of the audience, shown above the title. */
    topic: z.string(),
    product: z.string(),
    title: z.string(),
    seo_title: z.string(),
    meta_description: z.string().max(160),
    /** Direct answer shown first on the page and reused by llms.txt. */
    summary: z.string(),
    /** Law the guide is about, when there is one (e.g. "Ley 7509"). */
    law: z.string().optional(),
    updated: z.coerce.date(),
  }),
});

/** Privacy policy and legal notice. `updated` is the version date. */
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    order: z.number().int(),
    url_slug: slug,
    title: z.string(),
    meta_description: z.string().max(160),
    updated: z.coerce.date(),
  }),
});

export const collections = { products, guides, legal };
