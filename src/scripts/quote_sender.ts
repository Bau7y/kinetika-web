/**
 * Sends a form to an Astro action and turns the answer into one error code
 * (or null when it was accepted). Validation errors carry the code of the
 * first invalid field; other errors carry it as their message.
 */
import { isInputError, type ActionError } from 'astro:actions';

const KNOWN = /^[a-z_]+$/;

export function toErrorCode(error: ActionError | undefined): string | null {
  if (!error) return null;
  if (isInputError(error)) {
    const first = Object.values(error.fields).flat().find(Boolean);
    return first && KNOWN.test(first) ? first : 'generic';
  }
  return KNOWN.test(error.message) ? error.message : 'generic';
}
