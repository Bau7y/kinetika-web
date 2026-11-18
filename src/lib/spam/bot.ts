/**
 * First two anti-spam layers, both invisible to people:
 * 1. Honeypot: a hidden field that only bots fill in.
 * 2. Minimum time: a form sent less than 3 s after it loaded.
 * The caller answers "sent" without sending anything, so bots get no signal.
 */
export const MIN_SUBMIT_TIME_MS = 3000;

export interface BotSignals {
  /** Honeypot value; must be empty. */
  website: string;
  /** Form load time (ms since epoch), set by the page script; 0 if missing. */
  loadedAt: number;
  now?: number;
}

export function isBotSubmission({ website, loadedAt, now = Date.now() }: BotSignals): boolean {
  if (website !== '') return true;
  return loadedAt > 0 && now - loadedAt < MIN_SUBMIT_TIME_MS;
}
