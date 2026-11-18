/**
 * Online ordering demo: sample menu and kitchen panel labels.
 * Texts of the demo, kept out of the component so they can be edited
 * without touching the markup. Sample data only.
 */
export const ordersCopy = {
  es: {
    menu: 'Menú · Soda La Esquina',
    items: [
      { id: 'casado', name: 'Casado con pollo', price: 3500 },
      { id: 'arroz', name: 'Arroz cantonés', price: 3200 },
      { id: 'fresco', name: 'Fresco natural', price: 1200 },
    ],
    add: 'Agregar',
    remove: 'Quitar',
    total: 'Total',
    send: 'Enviar pedido',
    kitchen: 'Panel de cocina',
    empty: 'Todavía no hay pedidos.',
    statuses: ['Nuevo', 'En cocina', 'Listo'],
    next: 'Pasar a',
    done: 'Entregado',
  },
  en: {
    menu: 'Menu · La Esquina Diner',
    items: [
      { id: 'casado', name: 'Chicken casado', price: 3500 },
      { id: 'arroz', name: 'Fried rice', price: 3200 },
      { id: 'fresco', name: 'Fresh juice', price: 1200 },
    ],
    add: 'Add',
    remove: 'Remove',
    total: 'Total',
    send: 'Send order',
    kitchen: 'Kitchen panel',
    empty: 'No orders yet.',
    statuses: ['New', 'Cooking', 'Ready'],
    next: 'Move to',
    done: 'Delivered',
  },
} as const;
