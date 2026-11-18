/**
 * Website demo: sample site and contact form labels.
 * Texts of the demo, kept out of the component so they can be edited
 * without touching the markup. Sample data only.
 */
export const websiteCopy = {
  es: {
    site: 'Ferretería El Roble',
    site_text: 'Herramientas, pintura y materiales en Ciudad Quesada.',
    name: 'Nombre',
    name_value: 'María Solís',
    message: 'Mensaje',
    message_value: '¿Tienen pintura para exteriores en color arena?',
    send: 'Enviar',
    inbox: 'Tu bandeja',
    now: 'ahora',
    first: { from: 'Carlos Méndez', text: '¿Hacen entregas en La Fortuna?', when: 'hace 2 min' },
    empty_name: 'Sin nombre',
  },
  en: {
    site: 'El Roble Hardware',
    site_text: 'Tools, paint and building supplies in Ciudad Quesada.',
    name: 'Name',
    name_value: 'María Solís',
    message: 'Message',
    message_value: 'Do you have exterior paint in a sand color?',
    send: 'Send',
    inbox: 'Your inbox',
    now: 'now',
    first: { from: 'Carlos Méndez', text: 'Do you deliver to La Fortuna?', when: '2 min ago' },
    empty_name: 'No name',
  },
} as const;
