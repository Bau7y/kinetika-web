import type { APIRoute } from 'astro';
import { getProducts } from '../data/products';
import { getGuides } from '../data/guides';
import { faq } from '../data/faq';
import { districts } from '../data/service_area';
import { site } from '../data/site';
import { useTranslations } from '../i18n/ui';
import { faqMarkdown, guideMarkdown, productMarkdown } from '../lib/llms';

/**
 * The full content of the Spanish site in one Markdown file (llmstxt.org
 * convention): products, guides and answers, without layout or scripts.
 * English pages mirror it under /en.
 */
export const GET: APIRoute = async ({ site: base }) => {
  const t = useTranslations('es');
  const products = await getProducts('es');
  const guides = await getGuides('es');

  const body = [
    `# ${site.name}: contenido completo`,
    '',
    `> ${t('about.definition')}`,
    '',
    `Atención en persona: ${districts.join(', ')} (cantón de ${site.locality}, ${site.region}). En línea: todo Costa Rica.`,
    `Idiomas del sitio: español (${new URL('/', base!)}) e inglés (${new URL('/en', base!)}).`,
    'Precios: no se publican; cada proyecto se cotiza sin costo después de una primera conversación.',
    '',
    '# Productos',
    '',
    ...products.map((p) => productMarkdown(base!, p, t(`status.${p.data.status}`)) + '\n'),
    '# Preguntas frecuentes',
    '',
    faqMarkdown(faq.es),
    '',
    '# Guías',
    '',
    ...guides.map((g) => guideMarkdown(base!, g) + '\n'),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
