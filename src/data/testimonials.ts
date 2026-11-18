import type { Lang } from '../i18n/routes';

/**
 * Client testimonials. The section stays hidden while this list is empty.
 * Add one only with the client's written permission, in their own words:
 * never invented, edited for meaning or translated without their approval.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Key of the project in the work collection, if it is about one. */
  project?: string;
  /** Date of the written permission, kept for the record. */
  consent: string;
}

export const testimonials: Record<Lang, Testimonial[]> = {
  es: [],
  en: [],
};
