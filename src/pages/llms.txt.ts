import type { APIRoute } from 'astro';
import { getPages, type PageEntry } from '../data/pages';
import { getProducts } from '../data/products';
import { getGuides } from '../data/guides';
import { faq } from '../data/faq';
import { districts } from '../data/service_area';
import { site } from '../data/site';
import { useTranslations } from '../i18n/ui';

/**
 * Summary of the site for AI assistants (llmstxt.org): what Kinetika does,
 * its products with their status, the guides and the short answers, so they
 * can cite the right page.
 */
export const GET: APIRoute = async ({ site: base }) => {
  const t = useTranslations('es');
  const pages = await getPages();
  const products = await getProducts('es');
  const guides = await getGuides('es');
  const abs = (path: string) => new URL(path, base).toString();
  const list = (filter: (p: PageEntry) => boolean) =>
    pages.filter(filter).map((p) => `- [${p.title}](${abs(p.path)}): ${p.description}`);

  const body = [
    `# ${site.name}`,
    '',
    `> ${t('site.description')}`,
    '',
    `Atiende en persona en los distritos de ${site.locality} (${districts.join(', ')}) y en línea en todo Costa Rica.`,
    '',
    '## Productos',
    ...products.map((p) => `- [${p.data.name}](${abs(p.href)}) (${t(`status.${p.data.status}`)}): ${p.data.summary}`),
    '',
    '## Guías',
    ...guides.map((g) => `- [${g.data.title}](${abs(g.href)}): ${g.data.summary}`),
    '',
    '## Preguntas frecuentes',
    ...faq.es.map(({ q, a }) => `- ${q} ${a}`),
    '',
    '## Cotización y legal',
    ...list((p) => p.lang === 'es' && (p.section === 'quote' || p.section === 'legal')),
    '',
    '## English',
    ...list((p) => p.lang === 'en' && p.section !== 'legal'),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
