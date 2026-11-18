import { describe, expect, it } from 'vitest';
import { testimonials } from '../../src/data/testimonials';

describe('testimonios', () => {
  it('cada testimonio tiene permiso con fecha válida', () => {
    for (const item of [...testimonials.es, ...testimonials.en]) {
      expect(item.consent).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(item.consent))).toBe(false);
    }
  });

  it('español e inglés tienen los mismos testimonios', () => {
    expect(testimonials.en.length).toBe(testimonials.es.length);
  });
});
