/**
 * Runs before first paint. Kept as a string so astro.config.mjs can hash
 * exactly the same bytes for the Content Security Policy.
 *
 * - `js`: enables the enhanced versions of the interactive sections (without
 *   it, every section shows its plain, readable fallback).
 */
export const THEME_INIT = `(() => {
  document.documentElement.classList.add('js');
})();`;
