/**
 * Working demo of each service or project, by entry key. An entry without
 * a demo shows only its description.
 */
import type { Lang } from '../../../i18n/routes';
import WebsiteDemo from './WebsiteDemo.astro';
import OrdersDemo from './OrdersDemo.astro';
import TramiDemo from './TramiDemo.astro';
import AccountingDemo from './AccountingDemo.astro';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DemoComponent = (props: { lang: Lang }) => any;

export const demos: Record<string, DemoComponent> = {
  'sitios-web': WebsiteDemo,
  pedidos: OrdersDemo,
  tramimunisc: TramiDemo,
  'plataforma-contable': AccountingDemo,
};
