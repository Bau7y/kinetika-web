/**
 * "A day in your business": one scene per service or project, in the order of a work
 * day. The rows are sample data for the demo cards.
 */
import type { Lang } from '../i18n/routes';
import type { WorkStatus } from './work_status';

export interface DayScene {
  hour: string;
  moment: string;
  /** Work key (file name in src/content/work/es). */
  product: string;
  name: string;
  status: WorkStatus;
  text: string;
  rows: [string, string][];
}

export const dayScenes: Record<Lang, DayScene[]> = {
  es: [
    {
      hour: '7:30',
      moment: 'Antes de abrir',
      product: 'sitios-web',
      name: 'Sitios web a la medida',
      status: 'available',
      text: 'Tus clientes te encuentran en Google y escriben desde tu sitio.',
      rows: [
        ['Formulario recibido', 'hace 2 min'],
        ['Visitas desde Google', 'hoy'],
      ],
    },
    {
      hour: '12:15',
      moment: 'Hora pico',
      product: 'pedidos',
      name: 'Pedidos para restaurantes',
      status: 'in_development',
      text: 'Los pedidos entran ordenados al panel de cocina, no al chat.',
      rows: [
        ['#014 Nuevo', '2 artículos'],
        ['#013 En cocina', '4 artículos'],
      ],
    },
    {
      hour: '15:40',
      moment: 'La diligencia',
      product: 'tramimunisc',
      name: 'TramiMuniSC',
      status: 'in_production',
      text: 'La declaración de bienes inmuebles avanza sin ir a la municipalidad.',
      rows: [
        ['Documentos recibidos', 'listo'],
        ['En revisión', 'ahora'],
      ],
    },
    {
      hour: '18:05',
      moment: 'Cierre del día',
      product: 'plataforma-contable',
      name: 'Plataforma contable',
      status: 'waitlist',
      text: 'Tu contador ve qué cliente debe documentos y qué vence esta semana.',
      rows: [
        ['Ferretería El Roble', 'faltan 2 docs'],
        ['Taller JR', 'vence IVA'],
      ],
    },
  ],
  en: [
    {
      hour: '7:30',
      moment: 'Before opening',
      product: 'sitios-web',
      name: 'Custom websites',
      status: 'available',
      text: 'Customers find you on Google and write to you from your site.',
      rows: [
        ['Form received', '2 min ago'],
        ['Visits from Google', 'today'],
      ],
    },
    {
      hour: '12:15',
      moment: 'Rush hour',
      product: 'pedidos',
      name: 'Restaurant ordering',
      status: 'in_development',
      text: 'Orders land neatly on the kitchen panel, not in the chat.',
      rows: [
        ['#014 New', '2 items'],
        ['#013 Cooking', '4 items'],
      ],
    },
    {
      hour: '15:40',
      moment: 'The errand',
      product: 'tramimunisc',
      name: 'TramiMuniSC',
      status: 'in_production',
      text: 'The property declaration moves forward without a trip to the municipality.',
      rows: [
        ['Documents received', 'done'],
        ['Under review', 'now'],
      ],
    },
    {
      hour: '18:05',
      moment: 'End of day',
      product: 'plataforma-contable',
      name: 'Accounting platform',
      status: 'waitlist',
      text: 'Your accountant sees which client owes documents and what is due this week.',
      rows: [
        ['El Roble Hardware', '2 docs missing'],
        ['JR Garage', 'VAT due'],
      ],
    },
  ],
};
