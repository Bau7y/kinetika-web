import { describe, expect, it } from 'vitest';
import { analyzeMessage, type Message } from '../../src/lib/spam/content';

const base: Message = {
  email: 'ana@gmail.com',
  message: 'Quiero un sitio web para mi soda en Quesada.',
  onTopic: true,
};
const check = (overrides: Partial<Message>) => analyzeMessage({ ...base, ...overrides });

describe('analyzeMessage', () => {
  it('entrega un mensaje normal', () => {
    expect(check({})).toEqual({ verdict: 'ok', reasons: [] });
  });

  it('entrega una cotización sin mensaje', () => {
    expect(check({ message: '' }).verdict).toBe('ok');
  });

  it('no trata como spam lo que Kinetika vende (web, SEO)', () => {
    expect(check({ message: 'Necesito diseño web y SEO para mi negocio' }).verdict).toBe('ok');
  });

  it('pide reescribir si hay lenguaje ofensivo, aunque esté disfrazado', () => {
    expect(check({ message: 'Son unos p3nd3jooo' }).verdict).toBe('offensive');
  });

  it('descarta spam con varios términos', () => {
    expect(check({ message: 'We sell backlinks and guest post packages' }).verdict).toBe('spam');
  });

  it('descarta acortadores, correos desechables y varios enlaces', () => {
    expect(check({ message: 'Vea https://bit.ly/x' }).verdict).toBe('spam');
    expect(check({ email: 'x@mailinator.com' }).verdict).toBe('spam');
    expect(check({ message: 'Mi sitio https://a.com https://b.com' }).verdict).toBe('spam');
  });

  it('descarta alfabetos no esperados', () => {
    expect(check({ message: 'Привет, sitio web' }).verdict).toBe('spam');
  });

  it('marca para revisar señales suaves', () => {
    expect(check({ message: 'Mi sitio actual es https://ejemplo.com' })).toMatchObject({
      verdict: 'review',
      reasons: ['incluye un enlace'],
    });
    expect(check({ message: 'NECESITO AYUDA URGENTE CON TODO ESTO POR FAVOR' }).reasons).toContain('casi todo en mayúsculas');
  });

  it('sin opción elegida, un texto ajeno a los productos se marca para revisar', () => {
    expect(check({ message: 'Buenas tardes, quería saludarles.', onTopic: false }).reasons).toContain(
      'no menciona temas de los productos',
    );
    expect(check({ message: 'Buenas tardes, quería saludarles.', onTopic: true }).verdict).toBe('ok');
  });
});
