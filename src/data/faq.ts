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
      q: '¿Qué es Kinetika?',
      a: 'Un estudio de San Carlos, Costa Rica, que automatiza procesos de negocios con sitios y sistemas web y crea sitios que amplían su alcance. Sus proyectos muestran cómo: TramiMuniSC para trámites municipales, pedidos en línea para restaurantes y una plataforma para despachos contables.',
    },
    {
      q: '¿Trabajan con negocios fuera de San Carlos?',
      a: 'Sí. Atendemos en persona en la zona norte y en línea en todo Costa Rica.',
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
      q: '¿Qué incluye un sitio web de Kinetika?',
      a: 'Diseño propio, carga rápida, preparación para Google (sitemap y datos estructurados), formularios protegidos contra spam con consentimiento según la Ley 8968 y, si lo necesita, versión en inglés.',
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
      a: 'No. Se suma al que ya usa: importa su Excel y organiza clientes y vencimientos.',
    },
    {
      q: '¿Atienden en La Fortuna, Aguas Zarcas o Pital?',
      a: 'Sí. Atendemos en persona en los 13 distritos de San Carlos, entre ellos Quesada, La Fortuna, Aguas Zarcas y Pital.',
    },
    {
      q: '¿Pueden hacer el sitio en español y en inglés?',
      a: 'Sí. El sitio puede tener las dos versiones, enlazadas entre sí para que Google muestre a cada visitante la de su idioma.',
    },
  ],
  en: [
    {
      q: 'What is Kinetika?',
      a: 'A studio in San Carlos, Costa Rica, that automates business processes with websites and web systems and builds sites that extend their reach. Its projects show how: TramiMuniSC for municipal procedures, online ordering for restaurants and a platform for accounting firms.',
    },
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
      q: 'What does a Kinetika website include?',
      a: 'Its own design, fast loading, search engine readiness (sitemap and structured data), spam-protected forms with consent under Costa Rica’s Law 8968 and, if you need it, an English version.',
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
    {
      q: 'Do you work in La Fortuna, Aguas Zarcas or Pital?',
      a: 'Yes. We meet clients in person in all 13 districts of San Carlos, including Quesada, La Fortuna, Aguas Zarcas and Pital.',
    },
    {
      q: 'Can the site be in Spanish and English?',
      a: 'Yes. The site can have both versions, linked to each other so Google shows each visitor the one in their language.',
    },
  ],
};
