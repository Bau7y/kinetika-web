import { describe, expect, it } from 'vitest';
import { isBotSubmission, MIN_SUBMIT_TIME_MS } from '../../src/lib/spam/bot';

describe('isBotSubmission', () => {
  const now = 1_000_000;

  it('detecta el campo trampa lleno', () => {
    expect(isBotSubmission({ website: 'http://spam.example', loadedAt: 0, now })).toBe(true);
  });

  it('detecta envíos más rápidos que el tiempo mínimo', () => {
    expect(isBotSubmission({ website: '', loadedAt: now - MIN_SUBMIT_TIME_MS + 1, now })).toBe(true);
  });

  it('deja pasar a una persona', () => {
    expect(isBotSubmission({ website: '', loadedAt: now - 10_000, now })).toBe(false);
  });

  it('sin marca de tiempo no bloquea (JS desactivado o dato faltante)', () => {
    expect(isBotSubmission({ website: '', loadedAt: 0, now })).toBe(false);
  });
});
