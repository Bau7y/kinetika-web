/** How a project moves forward, shown on the home page ("Cómo trabajamos"). */
import type { Lang } from '../i18n/routes';

export interface ProcessStep {
  title: string;
  text: string;
}

export const process: Record<Lang, ProcessStep[]> = {
  es: [
    { title: 'Conversación', text: 'Entendemos tu negocio, tus clientes y lo que querés resolver primero.' },
    { title: 'Demo funcional', text: 'Te mostramos una primera versión que funciona antes de cualquier contrato.' },
    { title: 'Construcción por etapas', text: 'Avanzamos por partes y revisás cada entrega antes de seguir.' },
    { title: 'Publicación', text: 'Lo publicamos en tu dominio y lo dejamos listo para que te encuentren en Google.' },
  ],
  en: [
    { title: 'Conversation', text: 'We learn about your business, your customers and what you want to solve first.' },
    { title: 'Working demo', text: 'We show you a first version that works before any contract.' },
    { title: 'Built in stages', text: 'We move part by part and you review every delivery before we go on.' },
    { title: 'Launch', text: 'We publish it on your domain and leave it ready to be found on Google.' },
  ],
};
