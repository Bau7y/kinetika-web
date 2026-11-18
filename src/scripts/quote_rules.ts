/**
 * Client-side rules of the quote form, mirrored from the server schema
 * (src/actions/index.ts), which stays the source of truth.
 */
import { MESSAGE_MAX } from '../data/quote_options';

export type ErrorCode = string;

/** Sends the form; resolves with an error code, or null when it was sent. */
export type QuoteSender = (data: FormData) => Promise<ErrorCode | null>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Client-side rules, mirrored from the server schema. Field → error code. */
export function validateQuote(data: FormData): Record<string, ErrorCode> {
  const errors: Record<string, ErrorCode> = {};
  const email = String(data.get('email') ?? '').trim();
  const message = String(data.get('message') ?? '').trim();
  if (!data.get('business')) errors.business = 'business_required';
  if (!data.get('need')) errors.need = 'need_required';
  if (!email) errors.email = 'email_required';
  else if (!EMAIL.test(email)) errors.email = 'email_invalid';
  if (message.length > MESSAGE_MAX) errors.message = 'message_max';
  if (data.get('consent') !== 'on') errors.consent = 'consent_required';
  return errors;
}
