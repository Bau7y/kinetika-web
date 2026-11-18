/**
 * Smoke tests over the production build served locally: key pages answer,
 * the security headers are configured, the forms validate before sending,
 * the language switch works and the SEO endpoints are well formed.
 *
 *   yarn build && yarn test:e2e
 */
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { startStaticServer } from '../../scripts/lib/static_server.mjs';

let server;
let browser;

before(async () => {
  server = await startStaticServer();
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
});

after(async () => {
  await browser?.close();
  server?.close();
});

const get = (path) => fetch(server.base + path);

async function open(path) {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(server.base + path);
  return page;
}

describe('páginas clave', () => {
  const paths = [
    '/', '/en', '/cotizar', '/en/quote', '/guias', '/en/guides', '/privacidad', '/en/privacy',
    '/servicios/automatizacion-de-procesos', '/servicios/sitios-web', '/proyectos/pedidos', '/proyectos/tramimunisc', '/proyectos/plataforma-contable',
    '/en/services/websites', '/en/projects/tramimunisc', '/guias/declaracion-de-bienes-inmuebles',
  ];

  for (const path of paths) {
    it(`${path} responde con un solo h1`, async () => {
      const res = await get(path);
      assert.equal(res.status, 200);
      const html = await res.text();
      assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
    });
  }
});

describe('seguridad', () => {
  it('ningún HTML usa atributos style (la CSP los bloquea en producción)', async () => {
    const { readdir } = await import('node:fs/promises');
    const root = '.vercel/output/static';
    const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html'));
    const offenders = [];
    for (const file of files) {
      const html = await readFile(`${root}/${file}`, 'utf8');
      // Skip <svg> presentation markup: only HTML style="" attributes matter
      if (/<[a-z][^>]*\sstyle=["']/i.test(html.replace(/<svg[\s\S]*?<\/svg>/g, ''))) offenders.push(file);
    }
    assert.deepEqual(offenders, []);
  });

  it('la CSP se envía como encabezado, sin unsafe-inline en scripts', async () => {
    const config = await readFile('.vercel/output/config.json', 'utf8');
    const csp = config.match(/"content-security-policy":\s*"([^"]+)"/i)?.[1] ?? '';
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /script-src 'self'/);
    assert.doesNotMatch(csp.match(/script-src[^;]*/)?.[0] ?? '', /unsafe-inline/);
  });

  it('vercel.json define los encabezados de seguridad en todas las rutas', async () => {
    const { headers } = JSON.parse(await readFile('vercel.json', 'utf8'));
    const keys = headers.find((h) => h.source === '/(.*)').headers.map((h) => h.key);
    for (const key of ['Strict-Transport-Security', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options', 'Cross-Origin-Opener-Policy']) {
      assert.ok(keys.includes(key), key);
    }
  });
});

describe('cotización', () => {
  it('pide correo y consentimiento antes de enviar', async () => {
    const page = await open('/cotizar');
    const form = page.locator('[data-quote]');
    await form.locator('.chat_option').first().click();
    await form.locator('[data-step="1"] .chat_option').first().click();
    await form.locator('button[type="submit"]').click();
    const invalid = await page.$$eval('[data-quote] [aria-invalid="true"]', (els) => els.map((e) => e.getAttribute('name')).sort());
    assert.deepEqual(invalid, ['consent', 'email']);
    assert.equal(await page.textContent('[data-error-for="consent"]'), 'Necesitamos tu autorización para usar estos datos.');
    assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-error-summary')), true);
    await page.close();
  });

  it('muestra los errores en inglés en /en/quote', async () => {
    const page = await open('/en/quote');
    const form = page.locator('[data-quote]');
    await form.locator('.chat_option').first().click();
    await form.locator('[data-step="1"] .chat_option').first().click();
    await form.locator('button[type="submit"]').click();
    assert.equal(await page.textContent('[data-error-for="consent"]'), 'We need your permission to use this information.');
    await page.close();
  });

  it('la lista de espera también valida', async () => {
    const page = await open('/proyectos/plataforma-contable');
    await page.click('[data-waitlist] button[type="submit"]');
    assert.equal(await page.textContent('[data-waitlist] [data-error-for="email"]'), 'Escribí tu correo.');
    await page.close();
  });
});

describe('idioma', () => {
  it('el selector lleva a la misma página en el otro idioma', async () => {
    const page = await open('/proyectos/pedidos');
    await page.click('[data-lang-switch]');
    await page.waitForURL(/\/en\/projects\/ordering$/);
    assert.equal(await page.getAttribute('html', 'lang'), 'en');
    await page.close();
  });
});

describe('SEO', () => {
  it('la 404 no se indexa ni declara canonical', async () => {
    const html = await (await get('/404.html')).text();
    assert.match(html, /<meta name="robots" content="noindex, follow"/);
    assert.doesNotMatch(html, /rel="canonical"/);
  });

  it('el sitemap lista cada página con sus versiones de idioma', async () => {
    const xml = await (await get('/sitemap.xml')).text();
    const urls = xml.match(/<url>/g) ?? [];
    const alternates = xml.match(/hreflang="x-default"/g) ?? [];
    assert.ok(urls.length >= 20);
    assert.equal(alternates.length, urls.length);
    assert.doesNotMatch(xml, /404/);
  });

  it('robots.txt apunta al sitemap y bloquea las acciones', async () => {
    const text = await (await get('/robots.txt')).text();
    assert.match(text, /Disallow: \/_actions\//);
    assert.match(text, /Sitemap: https:\/\/kinetika\.cr\/sitemap\.xml/);
  });

  it('cada página tiene su imagen Open Graph de 1200×630', async () => {
    const html = await (await get('/guias/cartera-de-clientes-con-excel')).text();
    const image = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    assert.ok(image?.endsWith('/og/guias/cartera-de-clientes-con-excel.png'));
    const png = Buffer.from(await (await get(new URL(image).pathname)).arrayBuffer());
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  });

  it('el inicio publica ProfessionalService y FAQPage', async () => {
    const html = await (await get('/')).text();
    assert.match(html, /"@type":"ProfessionalService"/);
    assert.match(html, /"@type":"FAQPage"/);
  });

  it('llms-full.txt trae el contenido completo y llms.txt lo enlaza', async () => {
    const full = await (await get('/llms-full.txt')).text();
    assert.match(full, /# Proyectos/);
    assert.match(full, /# Guías/);
    assert.match(await (await get('/llms.txt')).text(), /llms-full\.txt/);
  });

  it('las URLs antiguas de productos redirigen a servicios y proyectos', async () => {
    const config = JSON.parse(await readFile('.vercel/output/config.json', 'utf8'));
    const routes = JSON.stringify(config.routes);
    assert.match(routes, /productos\/pedidos/);
    assert.match(routes, /proyectos\/pedidos/);
  });

  it('cada proyecto muestra su caso: antes, qué se automatizó y hoy', async () => {
    const html = await (await get('/proyectos/tramimunisc')).text();
    assert.match(html, /id="case_title"/);
    assert.match(html, /En producción en tramimunisc\.com\./);
  });

  it('cada producto responde qué es en un bloque propio', async () => {
    const html = await (await get('/proyectos/tramimunisc')).text();
    assert.match(html, /<h2 id="answer_title"[^>]*>¿Qué es TramiMuniSC\?<\/h2>/);
  });

  it('los datos estructurados son JSON válido en todas las páginas clave', async () => {
    for (const path of ['/', '/en', '/servicios/sitios-web', '/proyectos/pedidos', '/guias/declaracion-de-bienes-inmuebles']) {
      const html = await (await get(path)).text();
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      assert.ok(blocks.length > 0, path);
      for (const [, json] of blocks) JSON.parse(json);
    }
  });

  it('llms.txt resume servicios, proyectos y guías', async () => {
    const text = await (await get('/llms.txt')).text();
    assert.match(text, /^# Kinetika/);
    assert.match(text, /## Servicios/);
    assert.match(text, /## Proyectos/);
    assert.match(text, /## Guías/);
  });
});
