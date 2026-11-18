/**
 * Before/after table on the home page: the same restaurant order, handled by
 * hand and with a web system. No figures: only what each step looks like.
 */
import type { Lang } from '../../i18n/routes';

export interface Row {
  task: string;
  before: string;
  after: string;
}

export interface Demo {
  caption: string;
  head_task: string;
  rows: Row[];
}

export const compareCopy: Record<Lang, Demo> = {
  es: {
    caption: 'Cada paso de un pedido de restaurante, hoy y con un sistema web',
    head_task: 'Paso',
    rows: [
      { task: 'Recibir el pedido', before: 'Llega por WhatsApp, llamada o mensaje directo.', after: 'Entra por un solo formulario, con platillos y cantidades.' },
      { task: 'Confirmar al cliente', before: 'Alguien responde uno por uno.', after: 'La confirmación sale sola al enviar el pedido.' },
      { task: 'Avisar a cocina', before: 'Se dicta o se reenvía una captura.', after: 'Aparece en el panel de cocina, ordenado por hora.' },
      { task: 'Calcular el total', before: 'Se suma a mano.', after: 'Sale de los precios cargados en el menú.' },
      { task: 'Dar seguimiento', before: 'El cliente pregunta por el chat si ya salió.', after: 'El estado se actualiza solo y el cliente lo ve.' },
    ],
  },
  en: {
    caption: 'Each step of a restaurant order, today and with a web system',
    head_task: 'Step',
    rows: [
      { task: 'Receive the order', before: 'It arrives by WhatsApp, a call or a direct message.', after: 'It comes in through one form, with dishes and quantities.' },
      { task: 'Confirm to the customer', before: 'Someone replies one by one.', after: 'The confirmation goes out by itself when the order is sent.' },
      { task: 'Tell the kitchen', before: 'It is dictated or a screenshot is forwarded.', after: 'It shows up on the kitchen panel, sorted by time.' },
      { task: 'Work out the total', before: 'It is added up by hand.', after: 'It comes from the prices loaded in the menu.' },
      { task: 'Follow up', before: 'The customer asks in the chat whether it is out yet.', after: 'The status updates itself and the customer sees it.' },
    ],
  },
};
