/**
 * Questions people ask before starting. Rendered on the home page and
 * published as schema.org FAQPage, so answers are plain text. An optional
 * link turns one phrase of the answer into an anchor.
 */
import type { Lang } from '../i18n/routes';

export interface FaqItem {
  q: string;
  a: string;
  link?: { text: string; href: string };
}

export const faq: Record<Lang, FaqItem[]> = {
  es: [
    {
      q: '¿Qué es Kinetika?',
      a: 'Un estudio de San Carlos, Costa Rica, que automatiza procesos de negocios con sitios y sistemas web y crea sitios que amplían su alcance. Sus proyectos muestran cómo: TramiMuniSC para trámites municipales, pedidos en línea para restaurantes y una plataforma para despachos contables.',
    },
    {
      q: '¿Puedo ver una demo antes de contratar?',
      a: 'Sí. Es el primer paso: le mostramos una versión funcional antes de cualquier contrato.',
    },
    {
      q: '¿Cuánto cuesta un sitio web?',
      a: 'Depende de lo que necesite. Le enviamos una cotización sin costo después de la primera conversación.',
    },
    {
      q: '¿Mi sitio va a aparecer en Google?',
      a: 'Lo dejamos listo para buscadores: sitemap, datos estructurados y registro en Search Console. El posicionamiento también depende del contenido y de la competencia.',
    },
  ],
  en: [
    {
      q: 'What is Kinetika?',
      a: 'A studio in San Carlos, Costa Rica, that automates business processes with websites and web systems and builds sites that extend their reach. Its projects show how: TramiMuniSC for municipal procedures, online ordering for restaurants and a platform for accounting firms.',
    },
    {
      q: 'Can I see a demo before hiring you?',
      a: 'Yes. It is the first step: we show you a working version before any contract.',
    },
    {
      q: 'How much does a website cost?',
      a: 'It depends on what you need. We send you a free quote after our first conversation.',
    },
    {
      q: 'Will my site show up on Google?',
      a: 'We leave it ready for search engines: sitemap, structured data and Search Console setup. Ranking also depends on your content and your competition.',
    },
  ],
};
