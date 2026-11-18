/**
 * "What happens when someone writes to you": the real path of a contact form
 * on a Kinetika site, one step per stage. The log lines describe what the
 * server does; they are not metrics.
 */
import type { Lang } from '../i18n/routes';

export interface FlowStep {
  title: string;
  text: string;
  log: string;
}

export const flowSteps: Record<Lang, FlowStep[]> = {
  es: [
    { title: 'Alguien escribe', text: 'Llena el formulario de su sitio desde el teléfono o la computadora.', log: 'POST /contacto' },
    { title: 'Se valida', text: 'El servidor revisa los campos y que el correo pueda recibir mensajes.', log: 'campos y correo válidos' },
    { title: 'Se filtra el spam', text: 'Campo trampa, tiempo mínimo, límite por IP y análisis del texto.', log: 'sin señales de spam' },
    { title: 'Llega a su correo', text: 'El mensaje entra a su bandeja con los datos ordenados y listo para responder.', log: 'correo enviado' },
    { title: 'El visitante lo sabe', text: 'Ve la confirmación al instante, sin recargar la página.', log: 'confirmación mostrada' },
  ],
  en: [
    { title: 'Someone writes', text: 'They fill in the form on your site from a phone or a computer.', log: 'POST /contact' },
    { title: 'It is validated', text: 'The server checks the fields and that the email can receive messages.', log: 'fields and email valid' },
    { title: 'Spam is filtered', text: 'Honeypot field, minimum time, per-IP limit and text analysis.', log: 'no spam signals' },
    { title: 'It reaches your inbox', text: 'The message lands in your mailbox with the data in order, ready to answer.', log: 'email sent' },
    { title: 'The visitor knows', text: 'They see the confirmation right away, without reloading the page.', log: 'confirmation shown' },
  ],
};
