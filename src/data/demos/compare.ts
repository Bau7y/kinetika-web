/**
 * Before/after comparison on the home page: the same lunch rush as a
 * WhatsApp chat and as a kitchen panel. Sample orders and messages.
 */
import type { BadgeTone } from '../../components/ui/Badge.astro';
import type { Lang } from '../../i18n/routes';

export interface Demo {
  after_label: string;
  before_label: string;
  orders: { id: string; text: string; status: string; tone: BadgeTone }[];
  note: string;
  chat: { from: 'them' | 'us'; text: string }[];
  pending: string;
}

export const compareCopy: Record<Lang, Demo> = {
  es: {
    after_label: 'Con Kinetika · panel de cocina, 12:14',
    before_label: 'Hoy · WhatsApp, 12:14',
    orders: [
      { id: '#014', text: '2 × Casado con pollo, 1 × Refresco', status: 'Nuevo', tone: 'ok' },
      { id: '#013', text: '4 × Casado, entrega a domicilio', status: 'En cocina', tone: 'warn' },
      { id: '#012', text: '1 × Arroz cantonés', status: 'Listo', tone: 'neutral' },
    ],
    note: 'Cada pedido entra con estado, total y hora. Nadie se queda esperando en el chat.',
    chat: [
      { from: 'them', text: '¿Tienen casado de pollo hoy?' },
      { from: 'them', text: 'Mándeme el precio porfa' },
      { from: 'us', text: 'Sí señora, ₡3 500' },
      { from: 'them', text: '¿Y para 4? ¿Llevan a domicilio?' },
      { from: 'them', text: '¿Ya salió mi pedido? Llevo 40 min' },
      { from: 'us', text: '¿Quién era el de la orden de arroz?' },
    ],
    pending: '3 pedidos sin confirmar',
  },
  en: {
    after_label: 'With Kinetika · kitchen panel, 12:14',
    before_label: 'Today · WhatsApp, 12:14',
    orders: [
      { id: '#014', text: '2 × Chicken casado, 1 × Soft drink', status: 'New', tone: 'ok' },
      { id: '#013', text: '4 × Casado, home delivery', status: 'Cooking', tone: 'warn' },
      { id: '#012', text: '1 × Fried rice', status: 'Ready', tone: 'neutral' },
    ],
    note: 'Every order arrives with its status, total and time. Nobody is left waiting in the chat.',
    chat: [
      { from: 'them', text: 'Do you have chicken casado today?' },
      { from: 'them', text: 'Send me the price please' },
      { from: 'us', text: 'Yes ma’am, ₡3,500' },
      { from: 'them', text: 'And for 4? Do you deliver?' },
      { from: 'them', text: 'Is my order out yet? It’s been 40 min' },
      { from: 'us', text: 'Who ordered the rice?' },
    ],
    pending: '3 unconfirmed orders',
  },
};
