// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

/**
 * `astro dev` injects unhashed <style> tags (Vite) that the CSP header would
 * block, leaving the page unstyled. The CSP applies to builds only.
 */
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://kinetika.cr',
  // staticHeaders: the CSP below is sent as an HTTP header for every page
  // (instead of a <meta>), so frame-ancestors also applies.
  adapter: vercel({ staticHeaders: true }),
  trailingSlash: 'never',
  // All CSS goes inside each HTML page: no render-blocking request and no
  // unstyled page if a separate stylesheet fails to load.
  build: { inlineStylesheets: 'always' },
  // No code blocks on the site; Shiki's inline styles would clash with the CSP
  markdown: { syntaxHighlight: false },
  // Astro hashes every script and style it emits, so nothing injected from
  // outside can run. Turnstile (captcha) is the only third party.
  security: isDev
    ? {}
    : {
        csp: {
          directives: [
            "default-src 'self'",
            "img-src 'self' data:",
            "font-src 'self'",
            "connect-src 'self' https://challenges.cloudflare.com",
            "frame-src https://challenges.cloudflare.com",
            "form-action 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'none'",
          ],
          scriptDirective: {
            resources: ["'self'", 'https://challenges.cloudflare.com'],
          },
        },
      },
});
