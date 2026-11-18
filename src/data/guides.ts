import { getLocalized, type Localized } from './localized';
import { routes, type Lang } from '../i18n/routes';

export type Guide = Localized<'guides'>;

export const getGuides = (lang: Lang) => getLocalized('guides', lang, routes.guides[lang]);
