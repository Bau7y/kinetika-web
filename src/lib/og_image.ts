/**
 * Open Graph image (1200×630 PNG) for one page, rendered at build time.
 * satori lays out the text as SVG paths (no system fonts needed) and sharp
 * rasterizes it. Pure function of its inputs: pages decide what to show.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';

import { OG_SIZE } from '../data/pages';

const require = createRequire(import.meta.url);
const fontFile = (weight: 400 | 700) => require.resolve(`@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-${weight}-normal.woff`);

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all(
    ([400, 700] as const).map(async (weight) => ({
      name: 'Plus Jakarta Sans',
      data: await readFile(fontFile(weight)),
      weight,
      style: 'normal' as const,
    })),
  ));

const COLORS = {
  bg: '#070B14',
  glow: '#172B5C',
  line: '#2B3650',
  text: '#E8EEF7',
  secondary: '#B4C0D3',
  accent: '#6EA8FF',
};

/** The glass K, as in the Logo component. */
const LOGO =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="rgba(255,255,255,0.18)" stroke="#fff" stroke-opacity="0.8" stroke-width="3" stroke-linejoin="round"><polygon points="26,8 40,8 30,92 16,92"/><polygon points="40,50 72,8 90,8 52,58"/><polygon points="47,53 58,45 86,92 69,92"/></g><line x1="2" y1="80" x2="98" y2="22" stroke="#6EA8FF" stroke-width="4"/></svg>',
  ).toString('base64');

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export interface OgContent {
  title: string;
  description: string;
  /** Small label above the title (the section). */
  eyebrow: string;
  footer: string;
}

export async function renderOgImage({ title, description, eyebrow, footer }: OgContent): Promise<Buffer> {
  const titleSize = title.length > 60 ? 52 : title.length > 40 ? 60 : 68;
  const svg = await satori(
    el(
      'div',
      {
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 72px',
        backgroundColor: COLORS.bg,
        backgroundImage: `radial-gradient(circle at 88% 0%, ${COLORS.glow} 0%, ${COLORS.bg} 60%)`,
        fontFamily: 'Plus Jakarta Sans',
        color: COLORS.text,
      },
      [
        el('div', { display: 'flex', alignItems: 'center', gap: 18 }, [
          el('img', { width: 56, height: 56 }, undefined, { src: LOGO, width: 56, height: 56 }),
          el('div', { display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 8 }, 'KINETIKA'),
        ]),
        el('div', { display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1040 }, [
          el(
            'div',
            {
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '8px 18px',
              borderRadius: 10,
              border: `1px solid ${COLORS.line}`,
              color: COLORS.accent,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
            },
            eyebrow,
          ),
          el('div', { display: 'block', fontSize: titleSize, fontWeight: 700, lineHeight: 1.06, letterSpacing: -2, lineClamp: 3 }, title),
          el('div', { display: 'block', fontSize: 26, lineHeight: 1.4, color: COLORS.secondary, maxWidth: 980, lineClamp: 2 }, description),
        ]),
        el('div', { display: 'flex', fontSize: 22, color: COLORS.secondary }, footer),
      ],
    ) as never,
    { ...OG_SIZE, fonts: await loadFonts() },
  );
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
}
