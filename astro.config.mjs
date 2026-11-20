// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import { createHash } from 'node:crypto';
import { THEME_INIT } from './src/lib/theme_init.mjs';

/**
 * `astro dev` injects unhashed <style> tags (Vite) that the CSP header would
 * block, leaving the page unstyled. The CSP applies to builds only.
 */
const isDev = process.argv.includes('dev');

/** CSP hash of the one inline script Astro does not process (runs before first paint). */
/** @type {`sha256-${string}`} */
const themeInitHash = `sha256-${createHash('sha256').update(THEME_INIT).digest('base64')}`;

export default defineConfig({
  site: 'https://www.kinetikacr.com',
  // staticHeaders: the CSP below is sent as an HTTP header for every page
  // (instead of a <meta>), so frame-ancestors also applies.
  adapter: vercel({ staticHeaders: true, webAnalytics: { enabled: true } }),
  trailingSlash: 'never',
  // Old URLs always point at the final page (never a redirect chain)
  redirects: {
    // The quote chat became the contact page
    '/cotizar': { status: 301, destination: '/contacto' },
    '/en/quote': { status: 301, destination: '/en/contact' },
    // /servicios and /proyectos became /soluciones and /experiencia
    '/servicios': { status: 301, destination: '/soluciones' },
    '/servicios/[slug]': { status: 301, destination: '/soluciones/[slug]' },
    '/proyectos': { status: 301, destination: '/experiencia' },
    '/proyectos/[slug]': { status: 301, destination: '/experiencia/[slug]' },
    '/en/services': { status: 301, destination: '/en/solutions' },
    '/en/services/[slug]': { status: 301, destination: '/en/solutions/[slug]' },
    '/en/projects': { status: 301, destination: '/en/work' },
    '/en/projects/[slug]': { status: 301, destination: '/en/work/[slug]' },
    // Even older product URLs
    '/productos/sitios-web': { status: 301, destination: '/soluciones/sitios-web' },
    '/productos/pedidos': { status: 301, destination: '/experiencia/pedidos' },
    '/productos/tramimunisc': { status: 301, destination: '/experiencia/tramimunisc' },
    '/productos/plataforma-contable': { status: 301, destination: '/experiencia/plataforma-contable' },
    '/en/products/websites': { status: 301, destination: '/en/solutions/websites' },
    '/en/products/ordering': { status: 301, destination: '/en/work/ordering' },
    '/en/products/tramimunisc': { status: 301, destination: '/en/work/tramimunisc' },
    '/en/products/accounting-platform': { status: 301, destination: '/en/work/accounting-platform' },
  },
  // All CSS goes inside each HTML page: no render-blocking request and no
  // unstyled page if a separate stylesheet fails to load.
  build: { inlineStylesheets: 'always' },
  // No code blocks on the site; Shiki's inline styles would clash with the CSP
  markdown: { syntaxHighlight: false },
  // Astro hashes every script and style it emits, so nothing injected from
  // outside can run. Turnstile (captcha) is the only third party.
  security: isDev
    ? { checkOrigin: true }
    : {
        // Rejects form posts whose Origin differs from the site (CSRF)
        checkOrigin: true,
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
            hashes: [themeInitHash],
          },
        },
      },
  // Secrets stay in .env (local) and in Vercel; never in the code.
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      // Inbox that receives quotes and waitlist sign-ups
      CONTACT_TO: envField.string({ context: 'server', access: 'secret' }),
      // Sender on a domain verified in Resend, e.g. "Kinetika <hola@kinetikacr.com>"
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret' }),
      // Optional anti-spam services: each layer turns on when its keys exist
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      UPSTASH_REDIS_REST_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
