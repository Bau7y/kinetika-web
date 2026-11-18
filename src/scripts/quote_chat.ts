/**
 * Quote chat. Each answered question collapses into a reply bubble and the
 * next one appears. The client checks the same rules as the server (which
 * stays the source of truth) and shows errors next to each field.
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

export function initQuoteChat(form: HTMLFormElement, send: QuoteSender = async () => null) {
  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('[data-step]')];
  const messages = JSON.parse(form.dataset.errors ?? '{}') as Record<string, string>;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const done = form.querySelector<HTMLElement>('[data-done]')!;
  const live = form.querySelector<HTMLElement>('[data-live]')!;
  const restart = form.querySelector<HTMLButtonElement>('[data-restart]')!;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const section = form.closest('section')!;
  const bars = [...section.querySelectorAll<HTMLElement>('.quote_bar')];
  const progressLabel = section.querySelector<HTMLElement>('.quote_progress_label');
  let sending = false;

  const setProgress = (reached: number) => {
    bars.forEach((bar, i) => bar.classList.toggle('is_on', i < reached));
    if (progressLabel) progressLabel.textContent = (progressLabel.dataset.template ?? '').replace('{n}', String(Math.min(reached, 3)));
  };

  const show = (index: number) => {
    steps.forEach((step, i) => step.toggleAttribute('data-pending', i > index));
    setProgress(index + 1);
    restart.hidden = index === 0;
  };

  // Answering a question: reply bubble + next question
  steps.forEach((step, i) => {
    const answer = step.querySelector<HTMLElement>('[data-answer]');
    step.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((radio) =>
      radio.addEventListener('change', () => {
        if (!answer) return;
        answer.textContent = radio.nextElementSibling?.textContent ?? radio.value;
        answer.hidden = false;
        step.toggleAttribute('data-answered', true);
        const next = steps[i + 1];
        if (!next) return;
        show(i + 1);
        const target = next.querySelector<HTMLElement>('input:not([type="hidden"]), textarea');
        target?.focus({ preventScroll: false });
        live.textContent = next.querySelector('legend')?.textContent ?? '';
      }),
    );
  });

  const fieldOf = (name: string) => form.elements.namedItem(name);

  const clearErrors = () => {
    summary.hidden = true;
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  };

  const showErrors = (errors: Record<string, ErrorCode>) => {
    const list = summary.querySelector('ul')!;
    list.replaceChildren(
      ...Object.values(errors).map((code) => {
        const li = document.createElement('li');
        li.textContent = messages[code] ?? messages.generic;
        return li;
      }),
    );
    for (const [field, code] of Object.entries(errors)) {
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
      if (slot) slot.textContent = messages[code] ?? messages.generic;
      const input = fieldOf(field);
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) input.setAttribute('aria-invalid', 'true');
    }
    summary.hidden = false;
    summary.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    clearErrors();
    const data = new FormData(form);
    const errors = validateQuote(data);
    if (Object.keys(errors).length > 0) {
      // A missing choice sends the visitor back to that question
      if (errors.business) show(0);
      else if (errors.need) show(1);
      showErrors(errors);
      return;
    }

    sending = true;
    submit.setAttribute('aria-disabled', 'true');
    submit.textContent = submit.dataset.sending ?? '';
    const code = await send(data).catch(() => 'generic');
    sending = false;
    submit.removeAttribute('aria-disabled');
    submit.textContent = submit.dataset.label ?? '';

    if (code) {
      const field = code.startsWith('email') ? 'email' : code === 'offensive' || code === 'message_max' ? 'message' : 'form';
      showErrors({ [field]: code });
      return;
    }

    steps[2].hidden = true;
    done.hidden = false;
    setProgress(3);
    done.focus();
  });

  restart.addEventListener('click', () => {
    form.reset();
    clearErrors();
    steps.forEach((step) => {
      step.hidden = false;
      step.removeAttribute('data-answered');
      const answer = step.querySelector<HTMLElement>('[data-answer]');
      if (answer) answer.hidden = true;
    });
    done.hidden = true;
    show(0);
    steps[0].querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  });

  show(0);
}
