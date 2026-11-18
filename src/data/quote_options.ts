/**
 * Choices of the quote chat. The keys travel in the form and are validated by
 * the server; the labels come from src/i18n/ui.ts.
 */
export const BUSINESS_TYPES = ['restaurant', 'accounting_firm', 'retail_services', 'other'] as const;
export const NEEDS = ['process_automation', 'website', 'online_orders', 'client_management'] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];
export type Need = (typeof NEEDS)[number];

export const MESSAGE_MAX = 2000;
