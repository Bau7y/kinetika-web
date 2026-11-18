/**
 * Captures each project's working demo for the home portfolio cards
 * (src/assets/work/<key>.png). Run after a build whenever a demo changes:
 *
 *   yarn build && yarn capture:work
 *
 * With --check (CI) it captures into a temporary folder and fails when a
 * capture differs from the committed one beyond a small tolerance, so the
 * cards never show an outdated demo. Font rendering differs slightly
 * between machines, hence a mean difference instead of exact pixels.
 */
import { mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
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

const check = process.argv.includes('--check');
const outDir = check ? await mkdtemp(join(tmpdir(), 'captures-')) : 'src/assets/work';
/** Mean absolute difference (0–255) above which a capture counts as outdated. */
const TOLERANCE = 3;
const stale = [];

/** Both images reduced to the same small grayscale grid, then compared. */
async function meanDifference(a, b) {
  const grid = (file) => sharp(file).resize(320, 160, { fit: 'fill' }).grayscale().raw().toBuffer();
  const [x, y] = await Promise.all([grid(a), grid(b)]);
  let total = 0;
  for (let i = 0; i < x.length; i++) total += Math.abs(x[i] - y[i]);
  return total / x.length;
}

const server = await startStaticServer();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  const entries = await readdir(new URL('../.vercel/output/static/experiencia/', import.meta.url), { withFileTypes: true });
  const slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  for (const slug of slugs) {
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      sessionStorage.setItem('kinetika_intro', '1');
      localStorage.setItem('kinetika_lang_dismissed', '1');
    });
    await page.goto(`${server.base}/experiencia/${slug}`);
    const stage = page.locator('.work_demo_stage').first();
    if (!(await stage.count())) {
      console.warn(`sin demo: ${slug}`);
      continue;
    }
    await stage.scrollIntoViewIfNeeded();
    await prepare[slug]?.(stage);
    await page.waitForTimeout(400);
    const file = join(outDir, `${slug}.png`);
    await stage.screenshot({ path: file });
    if (check) {
      const diff = await meanDifference(file, `src/assets/work/${slug}.png`).catch(() => Infinity);
      if (diff > TOLERANCE) stale.push(`${slug} (diferencia ${diff.toFixed(1)})`);
      console.log(`${diff > TOLERANCE ? '✗' : '✓'} ${slug}: diferencia ${diff.toFixed(1)}`);
    } else {
      console.log(`✓ ${slug}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (stale.length) {
  console.error(`Capturas desactualizadas: ${stale.join(', ')}. Corré yarn build && yarn capture:work.`);
  process.exit(1);
}
