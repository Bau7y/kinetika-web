/** Lifecycle of a service or project, shared by the home sections and the work pages. */
import type { BadgeTone } from '../components/ui/Badge.astro';
import type { UiKey } from '../i18n/ui';

export const WORK_STATUSES = ['available', 'in_production', 'in_development', 'waitlist'] as const;
export type WorkStatus = (typeof WORK_STATUSES)[number];

/** Badge color and label key of each status. The label always names it. */
export const statusBadge: Record<WorkStatus, { tone: BadgeTone; label: UiKey }> = {
  available: { tone: 'ok', label: 'status.available' },
  in_production: { tone: 'ok', label: 'status.in_production' },
  in_development: { tone: 'warn', label: 'status.in_development' },
  waitlist: { tone: 'neutral', label: 'status.waitlist' },
};
