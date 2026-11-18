import { describe, expect, it } from 'vitest';
import { validateQuote } from '../../src/scripts/quote_rules';
import { validateWaitlist } from '../../src/scripts/waitlist';

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};

describe('validateQuote (reglas del cliente, iguales al servidor)', () => {
  it('pide todo cuando el formulario está vacío', () => {
    expect(validateQuote(form({}))).toEqual({
      business: 'business_required',
      need: 'need_required',
      email: 'email_required',
      consent: 'consent_required',
    });
  });

  it('rechaza un correo mal escrito', () => {
    expect(validateQuote(form({ business: 'restaurant', need: 'website', email: 'ana@', consent: 'on' }))).toEqual({
      email: 'email_invalid',
    });
  });

  it('acepta una cotización completa', () => {
    expect(validateQuote(form({ business: 'restaurant', need: 'website', email: ' ana@negocio.cr ', consent: 'on' }))).toEqual({});
  });

  it('limita el largo del mensaje', () => {
    const errors = validateQuote(form({ business: 'restaurant', need: 'website', email: 'a@b.cr', consent: 'on', message: 'x'.repeat(2001) }));
    expect(errors).toEqual({ message: 'message_max' });
  });
});

describe('validateWaitlist', () => {
  it('exige correo y consentimiento', () => {
    expect(validateWaitlist(form({}))).toEqual({ email: 'email_required', consent: 'consent_required' });
  });

  it('acepta solo el correo con consentimiento', () => {
    expect(validateWaitlist(form({ email: 'ana@despacho.cr', consent: 'on' }))).toEqual({});
  });
});
