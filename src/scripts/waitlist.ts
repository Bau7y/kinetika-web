/**
 * Waitlist form: client checks (same rules as the server), inline errors with
 * a focused summary, and a status message once the sign-up is accepted.
 */
import type { QuoteSender } from './quote_chat';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateWaitlist(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const email = String(data.get('email') ?? '').trim();
  if (!email) errors.email = 'email_required';
  else if (!EMAIL.test(email)) errors.email = 'email_invalid';
  if (String(data.get('firm') ?? '').trim().length > 120) errors.firm = 'firm_max';
  if (data.get('consent') !== 'on') errors.consent = 'consent_required';
  return errors;
}

export function initWaitlist(form: HTMLFormElement, send: QuoteSender) {
  const messages = JSON.parse(form.dataset.errors ?? '{}') as Record<string, string>;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const done = form.querySelector<HTMLElement>('[data-done]')!;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const loadedAt = form.querySelector<HTMLInputElement>('[data-loaded-at]');
  if (loadedAt) loadedAt.value = String(Date.now());
  let sending = false;

  const clear = () => {
    summary.hidden = true;
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };

  const show = (errors: Record<string, string>) => {
    summary.querySelector('ul')!.replaceChildren(
      ...Object.values(errors).map((code) => Object.assign(document.createElement('li'), { textContent: messages[code] ?? messages.generic })),
    );
    for (const [field, code] of Object.entries(errors)) {
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
      if (slot) slot.textContent = messages[code] ?? messages.generic;
      form.querySelector(`[name="${field}"]`)?.setAttribute('aria-invalid', 'true');
    }
    summary.hidden = false;
    summary.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    clear();
    const data = new FormData(form);
    const errors = validateWaitlist(data);
    if (Object.keys(errors).length) return show(errors);

    sending = true;
    submit.setAttribute('aria-disabled', 'true');
    submit.textContent = submit.dataset.sending ?? '';
    const code = await send(data).catch(() => 'generic');
    sending = false;
    submit.removeAttribute('aria-disabled');
    submit.textContent = submit.dataset.label ?? '';

    if (code) {
      (window as { turnstile?: { reset: () => void } }).turnstile?.reset();
      return show({ [code.startsWith('email') ? 'email' : code === 'firm_max' || code === 'offensive' ? 'firm' : 'form']: code });
    }
    form.querySelectorAll<HTMLElement>('.waitlist_field, [type="submit"]').forEach((el) => (el.hidden = true));
    done.hidden = false;
    done.focus();
  });
}
