/**
 * Sections of a typical service-business page, in the order a visitor's
 * questions arrive (the usual landing-page anatomy: promise, proof, offer,
 * how it works, work, objections, call to action). Used by the page builder.
 */
import type { Lang } from '../i18n/routes';

export const sectionIds = ['hero', 'trust', 'services', 'how', 'projects', 'testimonials', 'pricing', 'faq', 'contact'] as const;
export type SectionId = (typeof sectionIds)[number];

export const presets = {
  minimal: ['hero', 'services', 'contact'],
  services: ['hero', 'trust', 'services', 'how', 'faq', 'contact'],
  full: [...sectionIds],
} as const satisfies Record<string, readonly SectionId[]>;
export type PresetId = keyof typeof presets;
export const defaultPreset: PresetId = 'services';

export interface SectionCopy {
  label: string;
  /** The question the visitor is asking when they reach this section. */
  question: string;
}

export const pageSections: Record<Lang, Record<SectionId, SectionCopy>> = {
  es: {
    hero: { label: 'Portada', question: '¿Qué es esto y es para mí?' },
    trust: { label: 'Confianza', question: '¿Es una empresa seria?' },
    services: { label: 'Servicios', question: '¿Qué hacen exactamente?' },
    how: { label: 'Cómo funciona', question: '¿Qué tengo que hacer yo?' },
    projects: { label: 'Proyectos', question: '¿Ya lo han hecho antes?' },
    testimonials: { label: 'Opiniones', question: '¿Qué dicen otros clientes?' },
    pricing: { label: 'Planes', question: '¿Cuánto cuesta?' },
    faq: { label: 'Preguntas', question: '¿Y si me quedan dudas?' },
    contact: { label: 'Contacto', question: '¿Cómo empiezo?' },
  },
  en: {
    hero: { label: 'Hero', question: 'What is this, and is it for me?' },
    trust: { label: 'Trust', question: 'Is this a serious company?' },
    services: { label: 'Services', question: 'What exactly do they do?' },
    how: { label: 'How it works', question: 'What do I have to do?' },
    projects: { label: 'Projects', question: 'Have they done this before?' },
    testimonials: { label: 'Reviews', question: 'What do other clients say?' },
    pricing: { label: 'Plans', question: 'How much does it cost?' },
    faq: { label: 'Questions', question: 'What if I still have doubts?' },
    contact: { label: 'Contact', question: 'How do I start?' },
  },
};
