/**
 * Working demo of each product, by product key. A product without an entry
 * shows only its description.
 */
import type { Lang } from '../../../i18n/routes';
import WebsiteDemo from './WebsiteDemo.astro';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DemoComponent = (props: { lang: Lang }) => any;

export const demos: Record<string, DemoComponent> = {
  'sitios-web': WebsiteDemo,
};
