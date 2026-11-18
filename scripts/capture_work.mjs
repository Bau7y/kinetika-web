/**
 * Captures each project's working demo for the home portfolio cards
 * (src/assets/work/<key>.png). Run after a build whenever a demo changes:
 *
 *   yarn build && yarn capture:work
 */
import { readdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { startStaticServer } from './lib/static_server.mjs';

/** Puts each demo in a filled-in state, so the capture shows the system working. */
const prepare = {
  pedidos: async (stage) => {
    const add = stage.getByRole('button', { name: /^\+$|agregar|añadir/i });
    for (const i of [0, 0, 1, 2]) await add.nth(i).click();
    await stage.getByRole('button', { name: /enviar pedido/i }).click();
  },
  tramimunisc: async (stage) => {
    for (const box of await stage.getByRole('checkbox').all()) await box.check();
    const next = stage.getByRole('button', { name: /avanzar/i });
    for (let i = 0; i < 2; i++) if (await next.isEnabled()) await next.click();
  },
  'plataforma-contable': async (stage) => {
    await stage.getByRole('button').first().click();
  },
};

const server = await startStaticServer();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  const slugs = await readdir(new URL('../.vercel/output/static/proyectos/', import.meta.url));
  for (const slug of slugs) {
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      sessionStorage.setItem('kinetika_intro', '1');
      localStorage.setItem('kinetika_lang_dismissed', '1');
    });
    await page.goto(`${server.base}/proyectos/${slug}`);
    const stage = page.locator('.product_demo_stage').first();
    if (!(await stage.count())) {
      console.warn(`sin demo: ${slug}`);
      continue;
    }
    await stage.scrollIntoViewIfNeeded();
    await prepare[slug]?.(stage);
    await page.waitForTimeout(400);
    await stage.screenshot({ path: `src/assets/work/${slug}.png` });
    console.log(`✓ ${slug}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
