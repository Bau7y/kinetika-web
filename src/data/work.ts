import { getLocalized, type Localized } from './localized';
import { routes, type Lang } from '../i18n/routes';

/**
 * What Kinetika offers (services) and what it has built (projects, shown as
 * case studies). Both live in the `work` collection; `kind` decides the URL.
 */
export type Work = Localized<'work'>;
export type WorkKind = 'service' | 'project';

const base = (kind: WorkKind, lang: Lang) => (kind === 'service' ? routes.servicesBase : routes.projectsBase)[lang];

/** Every entry of one language, in `order`, with the href of its kind. */
export async function getWork(lang: Lang): Promise<Work[]> {
  const [services, projects] = await Promise.all([
    getLocalized('work', lang, routes.servicesBase[lang]),
    getLocalized('work', lang, routes.projectsBase[lang]),
  ]);
  const byKind = (list: Work[], kind: WorkKind) => list.filter((w) => w.data.kind === kind);
  return [...byKind(services, 'service'), ...byKind(projects, 'project')];
}

export const getServices = async (lang: Lang) => (await getWork(lang)).filter((w) => w.data.kind === 'service');
export const getProjects = async (lang: Lang) => (await getWork(lang)).filter((w) => w.data.kind === 'project');

export async function getWorkHref(key: string, lang: Lang): Promise<string | undefined> {
  return (await getWork(lang)).find((w) => w.key === key)?.href;
}

export { base as workBase };
