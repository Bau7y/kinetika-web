import { getLocalized, type Localized } from './localized';
import { routes, type Lang } from '../i18n/routes';

export type Product = Localized<'products'>;

/** Products of one language, in menu order, with their localized href. */
export const getProducts = (lang: Lang) => getLocalized('products', lang, routes.productsBase[lang]);

export async function getProductHref(key: string, lang: Lang): Promise<string | undefined> {
  return (await getProducts(lang)).find((p) => p.key === key)?.href;
}
