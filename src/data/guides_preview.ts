/** Guide cards on the home page (replaced by the guides collection once it exists). */
import type { Lang } from '../i18n/routes';

export interface GuidePreview {
  slug: string;
  topic: string;
  title: string;
  summary: string;
}

export const guidesPreview: Record<Lang, GuidePreview[]> = {
  es: [
    {
      slug: 'pedidos-de-whatsapp-a-un-sistema',
      topic: 'Restaurantes',
      title: 'Cómo pasar los pedidos de WhatsApp a un sistema',
      summary: 'Qué cambia en la cocina, en la caja y para tus clientes.',
    },
    {
      slug: 'declaracion-de-bienes-inmuebles',
      topic: 'Trámites',
      title: 'Qué necesitás para la declaración de bienes inmuebles',
      summary: 'Documentos y pasos, explicados sin lenguaje técnico.',
    },
    {
      slug: 'cartera-de-clientes-con-excel',
      topic: 'Contadores',
      title: 'Cómo organizar la cartera de clientes con Excel',
      summary: 'Una plantilla y un método para el cierre de cada mes.',
    },
  ],
  en: [
    {
      slug: 'whatsapp-orders-to-a-system',
      topic: 'Restaurants',
      title: 'How to move WhatsApp orders into a system',
      summary: 'What changes in the kitchen, at the register and for your customers.',
    },
    {
      slug: 'property-declaration',
      topic: 'Procedures',
      title: 'What you need for the property declaration',
      summary: 'Documents and steps, explained without jargon.',
    },
    {
      slug: 'client-portfolio-with-excel',
      topic: 'Accountants',
      title: 'How to organize your client portfolio with Excel',
      summary: 'A template and a method for every month-end close.',
    },
  ],
};
