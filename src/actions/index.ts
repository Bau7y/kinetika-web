import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { canReceiveEmail } from '../lib/email';
import { BUSINESS_TYPES, MESSAGE_MAX, NEEDS } from '../data/quote_options';

/*
 * The server is the source of truth for every rule; the client repeats them
 * only for comfort. Error messages are codes (see `error.*` in
 * src/i18n/ui.ts): the interface shows them in the visitor's language.
 * Astro parses empty FormData fields as null.
 */
const email = z
  .string()
  .nullish()
  .transform((v) => (v ?? '').trim())
  .pipe(z.string().min(1, 'email_required').max(254, 'email_invalid').pipe(z.email('email_invalid')))
  .refine((v) => canReceiveEmail(v), 'email_unreachable');

// Ley 8968: written (electronic) consent. A checked checkbox sends "on".
const consent = z
  .string()
  .nullish()
  .refine((v) => v === 'on', 'consent_required');

const lang = z
  .enum(['es', 'en'])
  .nullish()
  .transform((v) => v ?? 'es');

export const quoteSchema = z.object({
  lang,
  business: z.enum(BUSINESS_TYPES, 'business_required'),
  need: z.enum(NEEDS, 'need_required'),
  email,
  message: z
    .string()
    .nullish()
    .transform((v) => (v ?? '').trim())
    .pipe(z.string().max(MESSAGE_MAX, 'message_max')),
  consent,
});

export const server = {
  sendQuote: defineAction({
    accept: 'form',
    input: quoteSchema,
    handler: async () => {
      return { sent: true };
    },
  }),
};
