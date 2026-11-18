/**
 * Performance budget, checked in CI on the production build served
 * locally. Pages: home, one service and one project (the heaviest demo).
 * Mobile profile with Lighthouse's default throttling.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: '.vercel/output/static',
      url: [
        'http://localhost/index.html',
        'http://localhost/soluciones/automatizacion-de-procesos/index.html',
        'http://localhost/experiencia/pedidos/index.html',
        'http://localhost/nosotros/index.html',
        'http://localhost/soluciones/index.html',
      ],
      // Three runs: the median ignores one cold start of the CI machine
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 2500, aggregationMethod: 'median' }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.01, aggregationMethod: 'median' }],
        'total-blocking-time': ['error', { maxNumericValue: 200, aggregationMethod: 'median' }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
