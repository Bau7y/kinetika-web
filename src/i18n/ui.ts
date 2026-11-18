/**
 * Interface strings in both languages. Long-form content (products, guides,
 * legal pages) lives in src/content; structured home data in src/data.
 * Spanish uses Costa Rican voseo, as the brand voice.
 */
import type { Lang } from './routes';

export { languages, routes, LANGS, DEFAULT_LANG, getLang, joinPath, homeAnchor, type Lang } from './routes';

const es = {
  'site.tagline': 'Software empresarial para negocios que no se detienen',
  'site.description':
    'Sitios web, pedidos en línea, trámites municipales y gestión contable para negocios de San Carlos y todo Costa Rica.',
  'meta.locale': 'es_CR',

  'nav.main_label': 'Principal',
  'nav.mobile_label': 'Menú',
  'nav.home': 'Inicio',
  'nav.home_label': 'Kinetika, inicio',
  'nav.products': 'Productos',
  'nav.day': 'Un día con nosotros',
  'nav.proof': 'El sitio como prueba',
  'nav.faq': 'Preguntas',
  'nav.guides': 'Guías',
  'nav.quote': 'Cotizar proyecto',
  'nav.open_menu': 'Abrir menú',
  'nav.close_menu': 'Cerrar menú',
  'nav.lang_switch': 'Read in English',
  'nav.skip': 'Saltar al contenido',

  'lang.suggest': '¿Preferís leer este sitio en español?',
  'lang.accept': 'Ver en español',
  'lang.dismiss': 'Cerrar sugerencia',

  'footer.products': 'Productos',
  'footer.company': 'Kinetika',
  'footer.legal': 'Legal',
  'footer.location': 'San Carlos, Alajuela, Costa Rica',
  'footer.rights': 'Todos los derechos reservados.',
  'footer.replay_intro': 'Ver la intro de nuevo',

  'status.available': 'Disponible',
  'status.in_production': 'En producción',
  'status.in_development': 'En desarrollo',
  'status.waitlist': 'Lista de espera',

  'breadcrumbs.label': 'Ruta de navegación',
  'updated.label': 'Actualizado el',

  'hero.title_a': 'Software empresarial para negocios que',
  'hero.title_b': 'no se detienen.',
  'hero.lede': 'Sitios web, pedidos en línea, trámites y gestión contable en San Carlos y todo Costa Rica.',
  'hero.cases_label': 'Elegí tu caso',
  'hero.case_restaurant': 'Tengo un restaurante',
  'hero.case_accounting': 'Llevo contabilidades',
  'hero.case_website': 'Necesito un sitio web',
  'hero.case_procedures': 'Hago trámites municipales',
  'hero.credentials_label': 'Lo que respalda el trabajo',
  'hero.cred_accounting': 'Contaduría',
  'hero.cred_accounting_text': 'Procesos y números claros',
  'hero.cred_projects': 'Administración de proyectos',
  'hero.cred_projects_text': 'Entregas por etapas',
  'hero.cred_software': 'Ingeniería de software',
  'hero.cred_software_text': 'Código propio, no plantillas',
  'hero.cred_live': 'En producción',

  'compare.title': 'Cambiá un interruptor, no tu forma de trabajar.',
  'compare.lede': 'Deslizá el control: el mismo mediodía de un restaurante, con y sin Kinetika.',
  'compare.before': 'Hoy',
  'compare.after': 'Con Kinetika',
  'compare.control': 'Comparar hoy con Kinetika',
  'compare.value': '{before} % hoy, {after} % con Kinetika',

  'day.title': 'Un día cualquiera, con todo en movimiento.',
  'day.lede': 'Avanzá las horas y mirá dónde entra cada producto.',
  'day.prev': 'Hora anterior',
  'day.next': 'Hora siguiente',
  'day.scenes_label': 'Escenas de un día de trabajo',
} as const;

type Strings = { readonly [K in keyof typeof es]: string };

const en: Strings = {
  'site.tagline': 'Business software for companies that never stop',
  'site.description':
    'Websites, online ordering, municipal procedures and accounting tools for businesses in San Carlos and all of Costa Rica.',
  'meta.locale': 'en_US',

  'nav.main_label': 'Main',
  'nav.mobile_label': 'Menu',
  'nav.home': 'Home',
  'nav.home_label': 'Kinetika, home',
  'nav.products': 'Products',
  'nav.day': 'A day with us',
  'nav.proof': 'This site as proof',
  'nav.faq': 'Questions',
  'nav.guides': 'Guides',
  'nav.quote': 'Get a quote',
  'nav.open_menu': 'Open menu',
  'nav.close_menu': 'Close menu',
  'nav.lang_switch': 'Leer en español',
  'nav.skip': 'Skip to content',

  'lang.suggest': 'Would you rather read this site in English?',
  'lang.accept': 'View in English',
  'lang.dismiss': 'Close suggestion',

  'footer.products': 'Products',
  'footer.company': 'Kinetika',
  'footer.legal': 'Legal',
  'footer.location': 'San Carlos, Alajuela, Costa Rica',
  'footer.rights': 'All rights reserved.',
  'footer.replay_intro': 'Replay the intro',

  'status.available': 'Available',
  'status.in_production': 'In production',
  'status.in_development': 'In development',
  'status.waitlist': 'Waitlist',

  'breadcrumbs.label': 'Breadcrumb',
  'updated.label': 'Updated on',

  'hero.title_a': 'Business software for companies that',
  'hero.title_b': 'never stop.',
  'hero.lede': 'Websites, online ordering, procedures and accounting tools in San Carlos and all of Costa Rica.',
  'hero.cases_label': 'Pick your case',
  'hero.case_restaurant': 'I run a restaurant',
  'hero.case_accounting': 'I handle accounting',
  'hero.case_website': 'I need a website',
  'hero.case_procedures': 'I deal with municipal procedures',
  'hero.credentials_label': 'What backs the work',
  'hero.cred_accounting': 'Accounting',
  'hero.cred_accounting_text': 'Clear processes and numbers',
  'hero.cred_projects': 'Project management',
  'hero.cred_projects_text': 'Delivery in stages',
  'hero.cred_software': 'Software engineering',
  'hero.cred_software_text': 'Our own code, no templates',
  'hero.cred_live': 'In production',

  'compare.title': 'Flip a switch, not the way you work.',
  'compare.lede': 'Drag the control: the same lunch rush at a restaurant, with and without Kinetika.',
  'compare.before': 'Today',
  'compare.after': 'With Kinetika',
  'compare.control': 'Compare today with Kinetika',
  'compare.value': '{before}% today, {after}% with Kinetika',

  'day.title': 'An ordinary day, with everything in motion.',
  'day.lede': 'Move through the hours and see where each product comes in.',
  'day.prev': 'Previous hour',
  'day.next': 'Next hour',
  'day.scenes_label': 'Scenes from a work day',
};

export const ui = { es, en } as const;
export type UiKey = keyof typeof es;

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key];
}

/** Long date in the page language: "17 de noviembre de 2026" / "November 17, 2026". */
export const formatDate = (date: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'es' ? 'es-CR' : 'en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
