import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import {
  RESEND_API_KEY,
  CONTACT_TO,
  CONTACT_FROM,
  TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
} from 'astro:env/server';
import { analyzeMessage, isBotSubmission, isRateLimited, verifyTurnstile } from '../lib/spam';
import { useTranslations, type UiKey } from '../i18n/ui';
import { privacyVersion } from '../data/legal';
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

/** Anti-spam fields present in every form: honeypot and load timestamp. */
const protection = {
  website: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
  loaded_at: z.coerce
    .number()
    .nullish()
    .transform((v) => v ?? 0),
  'cf-turnstile-response': z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
};

export const quoteSchema = z.object({
  ...protection,
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

export const waitlistSchema = z.object({
  ...protection,
  lang,
  product: z.string().trim().max(60).regex(/^[a-z0-9-]*$/),
  firm: z
    .string()
    .nullish()
    .transform((v) => (v ?? '').trim())
    .pipe(z.string().max(120, 'firm_max')),
  email,
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

/** Accepted messages per IP and hour, shared by every form. */
const RATE_LIMIT = { limit: 5, windowSeconds: 3600 };
const redis =
  UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN ? { url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN } : undefined;

interface Screened {
  website: string;
  loaded_at: number;
  'cf-turnstile-response': string;
  email: string;
  message: string;
  onTopic: boolean;
}

/**
 * Runs the anti-spam layers in order: honeypot and minimum time, limit per
 * IP, Turnstile (when configured) and content analysis.
 * Returns null when the submission must be dropped silently (the caller
 * still answers "sent"), or the review reasons ([] when clean). Throws when
 * the visitor has to be told.
 */
async function screen(input: Screened, ip: string): Promise<string[] | null> {
  if (isBotSubmission({ website: input.website, loadedAt: input.loaded_at })) return null;

  if (await isRateLimited(ip, { ...RATE_LIMIT, redis })) {
    throw new ActionError({ code: 'TOO_MANY_REQUESTS', message: 'rate_limited' });
  }

  if (TURNSTILE_SECRET_KEY && !(await verifyTurnstile(input['cf-turnstile-response'], TURNSTILE_SECRET_KEY, ip))) {
    throw new ActionError({ code: 'FORBIDDEN', message: 'captcha_failed' });
  }

  const analysis = analyzeMessage({ email: input.email, message: input.message, onTopic: input.onTopic });
  if (analysis.verdict === 'offensive') throw new ActionError({ code: 'BAD_REQUEST', message: 'offensive' });
  if (analysis.verdict === 'spam') {
    // Logged so the lists can be tuned; the sender sees a normal "sent".
    console.warn('[screen] spam descartado:', analysis.reasons.join(', '));
    return null;
  }
  return analysis.reasons;
}

// The email to the office is always in Spanish.
const es = useTranslations('es');

export const server = {
  sendQuote: defineAction({
    accept: 'form',
    input: quoteSchema,
    handler: async (input, context) => {
      const review = await screen({ ...input, onTopic: true }, context.clientAddress);
      if (!review) return { sent: true };

      const business = es(`quote.business.${input.business}` as UiKey);
      const need = es(`quote.need.${input.need}` as UiKey);

      await deliver({
        // [Revisar] lets a mail filter route doubtful messages to their own label
        subject: `${review.length ? '[Revisar] ' : ''}[Cotización] ${business} · ${need}`,
        replyTo: input.email,
        rows: [
          ['Negocio', business],
          ['Necesidad', need],
          ['Correo', input.email],
          ['Idioma', input.lang === 'en' ? 'Inglés' : 'Español'],
          ['Consentimiento', `Aceptó la política de privacidad (versión del ${await privacyVersion()})`],
          ...(review.length ? [['Revisar', review.join(', ')] as [string, string]] : []),
        ],
        message: input.message,
      });

      return { sent: true };
    },
  }),
  joinWaitlist: defineAction({
    accept: 'form',
    input: waitlistSchema,
    handler: async (input, context) => {
      const review = await screen({ ...input, message: input.firm, onTopic: true }, context.clientAddress);
      if (!review) return { sent: true };

      await deliver({
        subject: `${review.length ? '[Revisar] ' : ''}[Lista de espera] ${input.product}`,
        replyTo: input.email,
        rows: [
          ['Producto', input.product],
          ['Correo', input.email],
          ['Despacho', input.firm || 'No indicado'],
          ['Idioma', input.lang === 'en' ? 'Inglés' : 'Español'],
          ['Consentimiento', `Aceptó la política de privacidad (versión del ${await privacyVersion()})`],
          ...(review.length ? [['Revisar', review.join(', ')] as [string, string]] : []),
        ],
        message: '',
      });

      return { sent: true };
    },
  }),
};
