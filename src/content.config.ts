import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { WORK_STATUSES } from './data/work_status';

/**
 * Collections stored as src/content/<collection>/<lang>/<key>.md.
 * <key> (the Spanish file name) pairs both translations. `url_slug` is the
 * URL segment for that language (`slug` is reserved by the glob loader).
 */
const slug = z.string().regex(/^[a-z0-9-]+$/);

/**
 * Services (what we offer) and projects (case studies of what we built).
 * `kind` decides the URL: /servicios/<slug> or /proyectos/<slug>.
 */
const caseStudy = z.object({
  /** The manual process before. */
  problem: z.string(),
  /** What was automated and how. */
  solution: z.string(),
  /** Where it stands today. Facts only: no invented figures. */
  result: z.string(),
  /** Short labels of what the project uses (forms, panel, portal…). */
  tags: z.array(z.string()).min(1),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    kind: z.enum(['service', 'project']),
    order: z.number().int(),
    url_slug: slug,
    status: z.enum(WORK_STATUSES),
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
    /** Project already running on its own domain. */
    external_url: z.url().optional(),
    /** Last content review; shown on the page and used as sitemap lastmod. */
    updated: z.coerce.date(),
    /** Working demo (component keyed by entry in components/work/demos). */
    demo: z.object({ title: z.string(), text: z.string() }).optional(),
    /** Projects only: problem → solution → result. */
    case: caseStudy.optional(),
    highlights: z.object({
      title: z.string(),
      items: z.array(z.object({ title: z.string(), text: z.string() })).min(2),
    }),
    steps: z.object({
      title: z.string(),
      items: z.array(z.object({ title: z.string(), text: z.string() })).min(2),
    }),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    /** Direct answer to "what is it?": self-contained, 40–60 words. */
    answer: z.object({ question: z.string(), text: z.string() }),
    /** Two-way comparison table (today vs. automated). */
    comparison: z
      .object({
        title: z.string(),
        columns: z.tuple([z.string(), z.string()]),
        rows: z.array(z.tuple([z.string(), z.string(), z.string()])).min(2),
      })
      .optional(),
    cta: z.object({
      title: z.string(),
      text: z.string(),
    }),
  }).refine((d) => d.kind === 'service' || d.case, { message: 'projects need a case', path: ['case'] }),
});

/**
 * Practical guides: they answer one question in depth and link to the
 * service or project that solves it (`product` key in the work collection).
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
    /** Primary sources the guide relies on, listed at the end. */
    sources: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
    /** Short questions answered by the guide (FAQPage). */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
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

export const collections = { work, guides, legal };
