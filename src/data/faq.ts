/**
 * Questions people ask before starting. Rendered on the home page and
 * published as schema.org FAQPage, so answers are plain text. An optional
 * link turns one phrase of the answer into an anchor.
 */
import type { Lang } from '../i18n/routes';
import { site } from './site';

export interface FaqItem {
  q: string;
  a: string;
  link?: { text: string; href: string };
}

const tramimuni = { text: 'tramimunisc.com', href: site.external.tramimunisc };

export const faq: Record<Lang, FaqItem[]> = {
  es: [
    {
      q: '¿Trabajan con negocios fuera de San Carlos?',
      a: 'Sí. Atendemos en persona en la zona norte y en línea en todo Costa Rica.',
    },
    {
      q: '¿Puedo ver una demo antes de contratar?',
      a: 'Sí. Es el primer paso: te mostramos una versión funcional antes de cualquier contrato.',
    },
    {
      q: '¿Cuánto cuesta un sitio web?',
      a: 'Depende de lo que necesités. Te enviamos una cotización sin costo después de la primera conversación.',
    },
    {
      q: '¿Mi sitio va a aparecer en Google?',
      a: 'Lo dejamos listo para buscadores: sitemap, datos estructurados y registro en Search Console. El posicionamiento también depende del contenido y de la competencia.',
    },
    {
      q: '¿Qué es TramiMuniSC?',
      a: 'Nuestro servicio de acompañamiento para trámites municipales, ya en producción en tramimunisc.com.',
      link: tramimuni,
    },
    {
      q: '¿La plataforma contable reemplaza mi software?',
      a: 'No. Se suma al que ya usás: importás tu Excel y organizás clientes y vencimientos.',
    },
  ],
  en: [
    {
      q: 'Do you work with businesses outside San Carlos?',
      a: 'Yes. We meet in person in northern Costa Rica and work online with clients across the country.',
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
    {
      q: 'What is TramiMuniSC?',
      a: 'Our assistance service for municipal procedures, already live at tramimunisc.com.',
      link: tramimuni,
    },
    {
      q: 'Does the accounting platform replace my software?',
      a: 'No. It works alongside what you already use: import your Excel files and keep clients and deadlines organized.',
    },
  ],
};
