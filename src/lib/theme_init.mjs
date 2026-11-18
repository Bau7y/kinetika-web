/**
 * Runs before first paint. Kept as a string so astro.config.mjs can hash
 * exactly the same bytes for the Content Security Policy.
 *
 * - `js`: enables the enhanced versions of the interactive sections (without
 *   it, every section shows its plain, readable fallback).
 * - `intro`: plays the K intro on pages that have it (<html data-intro>),
 *   once per browser session and never with reduced motion.
 */
export const THEME_INIT = `(() => {
  const root = document.documentElement;
  root.classList.add('js');
  if (!root.hasAttribute('data-intro')) return;
  try {
    if (sessionStorage.getItem('kinetika_intro')) return;
  } catch {}
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('intro');
})();`;
