import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } from 'astro:env/server';
import { useTranslations, type UiKey } from '../i18n/ui';
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

let client: Resend | null = null;
const getClient = () => (client ??= new Resend(RESEND_API_KEY));

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

interface Mail {
  subject: string;
  replyTo: string;
  rows: [string, string][];
  message: string;
}

/** Sends a message to the office inbox. Every value is escaped. */
async function deliver({ subject, replyTo, rows, message }: Mail) {
  const text = [...rows.map(([key, value]) => `${key}: ${value}`), '', message].join('\n');
  const html = `
    <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([key, value]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#475569"><strong>${escapeHtml(key)}</strong></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
        )
        .join('')}
    </table>
    ${message ? `<p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>` : ''}
  `;

  const { error } = await getClient().emails.send({ from: CONTACT_FROM, to: [CONTACT_TO], replyTo, subject, text, html });
  if (error) {
    console.error('[deliver] Resend:', error);
    throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'generic' });
  }
}

// The email to the office is always in Spanish.
const es = useTranslations('es');

export const server = {
  sendQuote: defineAction({
    accept: 'form',
    input: quoteSchema,
    handler: async (input) => {
      const business = es(`quote.business.${input.business}` as UiKey);
      const need = es(`quote.need.${input.need}` as UiKey);

      await deliver({
        subject: `[Cotización] ${business} · ${need}`,
        replyTo: input.email,
        rows: [
          ['Negocio', business],
          ['Necesidad', need],
          ['Correo', input.email],
          ['Idioma', input.lang === 'en' ? 'Inglés' : 'Español'],
          ['Consentimiento', 'Aceptó la política de privacidad'],
        ],
        message: input.message,
      });

      return { sent: true };
    },
  }),
};
