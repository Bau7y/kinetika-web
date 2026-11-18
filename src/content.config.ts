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

export const collections = { products };
