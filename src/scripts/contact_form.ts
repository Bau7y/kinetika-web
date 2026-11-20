/**
 * Contact form: one page, every question visible. Checks the same rules as
 * the server before sending, shows each error next to its field plus a
 * summary that takes focus, and swaps the form for a confirmation when the
 * message was accepted.
 */
import { validateQuote, type ErrorCode, type QuoteSender } from './quote_rules';

/** Field that shows a server error code. */
const fieldFor = (code: ErrorCode) =>
  code.startsWith('email') ? 'email' : code === 'offensive' || code === 'message_max' ? 'message' : 'form';

export function initContactForm(form: HTMLFormElement, send: QuoteSender) {
  const messages = JSON.parse(form.dataset.errors ?? '{}') as Record<string, string>;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const done = document.querySelector<HTMLElement>(`[data-done-for="${form.id}"]`);
  const again = done?.querySelector<HTMLButtonElement>('[data-again]');
  let sending = false;

  // Load time for the minimum-time check on the server
  const loadedAt = form.querySelector<HTMLInputElement>('[data-loaded-at]');
  const stamp = () => loadedAt && (loadedAt.value = String(Date.now()));
  stamp();

  /** A Turnstile token is single use: get a fresh one after each attempt. */
  const resetCaptcha = () => (window as { turnstile?: { reset: () => void } }).turnstile?.reset();

  const clearErrors = () => {
    summary.hidden = true;
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };

  const showErrors = (errors: Record<string, ErrorCode>) => {
    summary.querySelector('ul')!.replaceChildren(
      ...Object.values(errors).map((code) => {
        const li = document.createElement('li');
        li.textContent = messages[code] ?? messages.generic;
        return li;
      }),
    );
    for (const [field, code] of Object.entries(errors)) {
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
      if (slot) slot.textContent = messages[code] ?? messages.generic;
      form.querySelectorAll(`[name="${field}"]`).forEach((input) => input.setAttribute('aria-invalid', 'true'));
    }
    summary.hidden = false;
    summary.focus();
  };

  // A fixed error disappears as soon as the field changes
  form.addEventListener('change', (e) => {
    const name = (e.target as HTMLInputElement).name;
    if (!name) return;
    form.querySelectorAll(`[name="${name}"][aria-invalid]`).forEach((el) => el.removeAttribute('aria-invalid'));
    const slot = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (slot) slot.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    clearErrors();
    const data = new FormData(form);
    const errors = validateQuote(data);
    if (Object.keys(errors).length > 0) return showErrors(errors);

    sending = true;
    submit.setAttribute('aria-disabled', 'true');
    submit.textContent = submit.dataset.sending ?? '';
    const code = await send(data).catch(() => (navigator.onLine ? 'generic' : 'network'));
    sending = false;
    submit.removeAttribute('aria-disabled');
    submit.textContent = submit.dataset.label ?? '';

    if (code) {
      resetCaptcha();
      return showErrors({ [fieldFor(code)]: code });
    }
    // A page of its own gives the conversion a URL to measure
    if (form.dataset.thanksHref) return location.assign(form.dataset.thanksHref);
    if (!done) return;
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });

  again?.addEventListener('click', () => {
    form.reset();
    stamp();
    resetCaptcha();
    clearErrors();
    done!.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  });
}
