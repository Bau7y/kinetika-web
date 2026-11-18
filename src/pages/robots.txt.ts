import type { APIRoute } from 'astro';

/** Built from `site` in astro.config.mjs, so the sitemap URL follows the domain. */
export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      // Server endpoints of the forms: nothing to index
      'Disallow: /_actions/',
      '',
      `Sitemap: ${new URL('sitemap.xml', site)}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
