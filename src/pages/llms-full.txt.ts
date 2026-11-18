import type { APIRoute } from 'astro';
import { getProjects, getServices } from '../data/work';
import { getGuides } from '../data/guides';
import { faq } from '../data/faq';
import { districts } from '../data/service_area';
import { site } from '../data/site';
import { useTranslations } from '../i18n/ui';
import { faqMarkdown, guideMarkdown, workMarkdown } from '../lib/llms';

/**
 * The full content of the Spanish site in one Markdown file (llmstxt.org
 * convention): services, projects, guides and answers, without layout or scripts.
 * English pages mirror it under /en.
 */
export const GET: APIRoute = async ({ site: base }) => {
  const t = useTranslations('es');
  const services = await getServices('es');
  const projects = await getProjects('es');
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
    '# Servicios',
    '',
    ...services.map((s) => workMarkdown(base!, s, t(`status.${s.data.status}`)) + '\n'),
    '# Proyectos (casos de estudio)',
    '',
    ...projects.map((p) => workMarkdown(base!, p, t(`status.${p.data.status}`)) + '\n'),
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
