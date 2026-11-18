# kinetika-web

Sitio web de **Kinetika**, estudio de software de San Carlos, Costa Rica. Funciona como landing de la empresa y como portafolio con demos funcionales de sus productos: sitios web a la medida, pedidos para restaurantes, TramiMuniSC y la plataforma contable.

- Dominio previsto: `kinetika.cr`
- Diseño de referencia: lienzo de diseño "Kinetika — Direcciones de landing", artboard **F · Landing v2**
- Base técnica: [Landing_TramiMuniSC](https://github.com/Bau7y/Landing_TramiMuniSC) (requisitos no funcionales comunes de la marca)

## Stack

| Capa | Tecnología | Uso |
|---|---|---|
| Framework | [Astro](https://astro.build) 7 + TypeScript | Páginas estáticas, islas de JS solo donde hay interacción |
| Estilos | CSS nativo con variables (`snake_case`) | Sin frameworks CSS; CSS crítico dentro del HTML |
| Interacción | JavaScript nativo (Web APIs) | Comparador, línea de tiempo, plano, chat de cotización |
| Animación | CSS (`@keyframes`, `animation-timeline: view()`) + WAAPI | Solo `transform`, `opacity` y `clip-path`; respeta `prefers-reduced-motion` |
| Tipografía | `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/geist-mono` | Fuentes autoalojadas, `woff2` variable |
| Hosting | Vercel (`@astrojs/vercel`) | Encabezados de seguridad, Web Analytics y Speed Insights |
| Correo | Resend | Formulario de cotización |
| Anti-spam | Cloudflare Turnstile + Upstash Redis | Captcha invisible y límite de envíos por IP |
| Imágenes OG | Satori + Sharp | Una imagen Open Graph por página |
| Pruebas | Vitest, Playwright, axe-core, `astro check` | Unitarias, de humo y de accesibilidad |

## Estructura

```text
kinetika-web/
├── public/
│   └── favicon.svg
├── scripts/
│   ├── a11y.mjs                  # axe sobre el build local, en escritorio y móvil
│   └── lib/static_server.mjs     # sirve el build para las pruebas locales
├── src/
│   ├── actions/
│   │   └── index.ts              # cotización y lista de espera (validación + anti-spam + Resend)
│   ├── assets/
│   │   └── hero.jpg              # fondo del hero (se sirve en AVIF/WebP)
│   ├── components/
│   │   ├── brand/
│   │   │   ├── Logo.astro        # K de vidrio en SVG
│   │   │   └── Intro.astro       # la K se arma al cargar
│   │   ├── layout/
│   │   │   ├── Fonts.astro       # @font-face y precarga
│   │   │   ├── NavBar.astro       # menú pill flotante con indicador de sección
│   │   │   ├── LangSwitch.astro
│   │   │   ├── LangSuggest.astro # sugerencia de idioma no intrusiva
│   │   │   ├── SkipLink.astro
│   │   │   └── Footer.astro
│   │   ├── sections/             # secciones del inicio, una por commit
│   │   │   ├── Hero.astro
│   │   │   ├── StatsStrip.astro     # datos tomados de products y service_area
│   │   │   ├── SwitchCompare.astro
│   │   │   ├── DayTimeline.astro
│   │   │   ├── Blueprint.astro
│   │   │   ├── Process.astro        # Cómo trabajamos
│   │   │   ├── WhyServiceArea.astro
│   │   │   ├── FaqGuides.astro
│   │   │   └── QuoteChat.astro
│   │   ├── product/              # bloques de las páginas de producto
│   │   │   ├── ProductHero.astro
│   │   │   ├── ProductDemo.astro
│   │   │   ├── WaitlistForm.astro
│   │   │   └── demos/            # una demo funcional por producto (datos de ejemplo)
│   │   │       ├── index.ts
│   │   │       ├── WebsiteDemo.astro
│   │   │       ├── OrdersDemo.astro
│   │   │       ├── TramiDemo.astro
│   │   │       └── AccountingDemo.astro
│   │   └── ui/
│   │       ├── Badge.astro
│   │       ├── Button.astro
│   │       ├── Breadcrumbs.astro
│   │       ├── GuideCards.astro
│   │       ├── Prose.astro
│   │       └── JsonLd.astro
│   ├── content/                  # un archivo por idioma y entrada
│   │   ├── guides/{es,en}/
│   │   ├── products/{es,en}/
│   │   └── legal/{es,en}/
│   ├── content.config.ts
│   ├── data/
│   │   ├── site.ts               # nombre, dominio, contacto, redes
│   │   ├── pages.ts              # registro único de páginas (sitemap, OG, llms.txt, hreflang)
│   │   ├── localized.ts          # colecciones por idioma con su ruta
│   │   ├── products.ts / guides.ts / legal.ts
│   │   ├── product_status.ts     # estados de producto y su etiqueta
│   │   ├── day_scenes.ts
│   │   ├── service_area.ts       # 13 distritos de San Carlos
│   │   ├── faq.ts
│   │   ├── process.ts            # pasos de Cómo trabajamos
│   │   └── quote_options.ts      # opciones del chat de cotización
│   ├── i18n/
│   │   ├── ui.ts                 # textos de interfaz ES / EN
│   │   └── routes.ts             # rutas traducidas y equivalencias entre idiomas
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── email.ts              # el dominio del correo recibe correo (MX/A)
│   │   ├── structured_data.ts    # ProfessionalService, WebSite, Service, FAQPage, Article, BreadcrumbList
│   │   ├── llms.ts               # productos, guías y preguntas en Markdown para asistentes de IA
│   │   ├── og_image.ts
│   │   ├── theme_init.mjs        # clase js e intro antes del primer pintado (hash en la CSP)
│   │   └── spam/                 # campo trampa, tiempo mínimo, límite por IP, Turnstile, análisis
│   ├── views/                    # vistas compartidas por ES y EN
│   │   ├── HomeView.astro
│   │   ├── ProductView.astro
│   │   ├── GuidesIndexView.astro
│   │   ├── GuideView.astro
│   │   ├── QuoteView.astro
│   │   └── LegalView.astro
│   ├── pages/
│   │   ├── index.astro                     # /
│   │   ├── productos/[slug].astro          # /productos/sitios-web, /pedidos, /tramimunisc, /plataforma-contable
│   │   ├── guias/index.astro               # /guias
│   │   ├── guias/[slug].astro
│   │   ├── cotizar.astro                   # /cotizar
│   │   ├── [legal].astro                   # /privacidad, /aviso-legal
│   │   ├── en/
│   │   │   ├── index.astro                 # /en
│   │   │   ├── products/[slug].astro       # /en/products/websites, /ordering, /tramimunisc, /accounting-platform
│   │   │   ├── guides/index.astro
│   │   │   ├── guides/[slug].astro
│   │   │   ├── quote.astro
│   │   │   └── [legal].astro               # /en/privacy, /en/legal-notice
│   │   ├── 404.astro
│   │   ├── og/[...path].png.ts
│   │   ├── robots.txt.ts
│   │   ├── sitemap.xml.ts
│   │   ├── llms.txt.ts
│   │   └── llms-full.txt.ts      # contenido completo en Markdown
│   ├── scripts/                  # JS de cliente por sección
│   │   ├── hero_lines.ts         # arranca las líneas del hero cuando la página está libre
│   │   ├── hero_lines.worker.ts  # dibuja las líneas en un OffscreenCanvas (fuera del hilo principal)
│   │   ├── spotlight.ts          # luz que sigue al cursor en [data-spotlight]
│   │   ├── switch_compare.ts
│   │   ├── day_timeline.ts
│   │   ├── blueprint.ts
│   │   ├── quote_chat.ts
│   │   ├── quote_sender.ts       # respuesta de una acción → código de error
│   │   └── waitlist.ts
│   └── styles/
│       ├── tokens.css            # paleta, tipografía, espaciado, curvas de animación
│       └── global.css
├── tests/
│   ├── unit/                     # Vitest: anti-spam, correo, captcha, límite, reglas de formulario
│   └── e2e/                      # node:test + Playwright sobre el build
├── .github/workflows/ci.yml
├── .env.example
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vercel.json
├── vitest.config.ts
└── README.md
```

## Plan de trabajo (un commit por sección)

Estado: los 44 commits del plan están hechos. Además hubo commits de corrección y ajuste (`fix(home)`, `fix(brand)`, `feat(layout)` para los productos del pie, `feat(home)` para enlazar las escenas del día), visibles en el historial.

Idiomas: español (por defecto, sin prefijo) e inglés (`/en`), con rutas traducidas y `hreflang` recíproco.

### Base

| # | Commit |
|---|---|
| 0 | `docs: definir stack y estructura del proyecto` |
| 1 | `docs: ampliar plan de commits y soporte bilingüe` |
| 2 | `chore: inicializar Astro con TypeScript y adaptador de Vercel` |
| 3 | `chore: agregar encabezados de seguridad, CSP y caché` |
| 4 | `chore: agregar esquema de variables de entorno y .env.example` |
| 5 | `feat(ui): agregar tokens de diseño, fuentes y estilos globales` |
| 6 | `feat(i18n): agregar textos de interfaz y rutas traducidas` |
| 7 | `feat(data): agregar configuración del sitio y registro de páginas` |

### Esqueleto y marca

| # | Commit |
|---|---|
| 8 | `feat(layout): agregar BaseLayout con metadatos y hreflang` |
| 9 | `feat(layout): agregar navegación y selector de idioma` |
| 10 | `feat(layout): agregar pie de página y enlace para saltar al contenido` |
| 11 | `feat(brand): agregar logo de la K en SVG` |
| 12 | `feat(brand): agregar intro animada de la K` |
| 13 | `feat(ui): agregar componentes Button, Badge y Breadcrumbs` |

### Inicio (ES y EN)

| # | Commit |
|---|---|
| 14 | `feat(home): agregar hero con "Elegí tu caso" y credenciales` |
| 15 | `feat(home): agregar comparador antes y después` |
| 16 | `feat(home): agregar línea de tiempo de un día` |
| 17 | `feat(home): agregar plano anotado del sitio` |
| 18 | `feat(home): agregar por qué existimos y zonas de atención` |
| 19 | `feat(home): agregar preguntas frecuentes y avance de guías` |
| 20 | `feat(home): agregar cotización conversacional (interfaz)` |
| 21 | `feat(home): agregar versión en inglés del inicio` |

### Cotización y anti-spam

| # | Commit |
|---|---|
| 22 | `feat(contact): agregar validación del formulario en el servidor` |
| 23 | `feat(contact): agregar envío de correo con Resend` |
| 24 | `feat(spam): agregar campo trampa, tiempo mínimo y límite por IP` |
| 25 | `feat(spam): agregar Turnstile y análisis del contenido` |
| 26 | `feat(contact): agregar páginas /cotizar y /en/quote` |

### Páginas internas

| # | Commit |
|---|---|
| 27 | `feat(products): agregar plantilla de página de producto` |
| 28 | `feat(products): agregar página de sitios web a la medida` |
| 29 | `feat(products): agregar página de pedidos para restaurantes` |
| 30 | `feat(products): agregar página de TramiMuniSC` |
| 31 | `feat(products): agregar página de la plataforma contable con lista de espera` |
| 32 | `feat(guides): agregar colección de guías e índice` |
| 33 | `feat(guides): agregar página de guía con Article y migas de pan` |
| 34 | `docs(guides): agregar las tres primeras guías` |
| 35 | `feat(legal): agregar política de privacidad y aviso legal` |
| 36 | `feat: agregar página 404` |

### SEO y calidad

| # | Commit |
|---|---|
| 37 | `feat(seo): agregar datos estructurados JSON-LD` |
| 38 | `feat(seo): agregar sitemap, robots.txt y llms.txt` |
| 39 | `feat(seo): agregar imágenes Open Graph por página` |
| 40 | `feat: agregar Vercel Analytics y Speed Insights` |
| 41 | `test: agregar pruebas unitarias de anti-spam y validación` |
| 42 | `test: agregar pruebas de humo y de accesibilidad` |
| 43 | `ci: agregar flujo de integración continua` |

## Paleta

| Token | Valor |
|---|---|
| `--color_bg_base` | `#070B14` |
| `--color_bg_surface` | `#0D1422` |
| `--color_bg_raised` | `#111A2B` |
| `--color_line_subtle` | `#1C2536` |
| `--color_line_strong` | `#2B3650` |
| `--color_text_primary` | `#E8EEF7` |
| `--color_text_secondary` | `#B4C0D3` |
| `--color_text_muted` | `#94A3B8` |
| `--color_accent` | `#3D8BFF` |
| `--color_accent_text` | `#6EA8FF` |
| `--color_accent_cta` | `#2F6FEB` |

## Convenciones

- Identificadores de código en inglés; contenido en español.
- Clases y variables CSS en `snake_case` con un solo guion bajo.
- HTML semántico; sin frameworks CSS.
- Commits con [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/).
- Trabajo en ramas `feature/*`; tras cada merge se eliminan las ramas ya fusionadas.

## Scripts

| Comando | Acción |
|---|---|
| `yarn dev` | Servidor de desarrollo |
| `yarn build` | Build de producción |
| `yarn preview` | Sirve el build local |
| `yarn typecheck` | `astro check` |
| `yarn test` | Pruebas unitarias |
| `yarn test:e2e` | Pruebas de humo sobre el build |
| `yarn test:a11y` | Accesibilidad con axe (escritorio y móvil) |

## SEO, AEO y GEO

Cómo el sitio se deja encontrar por buscadores y citar por asistentes de IA (ChatGPT, Perplexity, AI Overviews):

- **Título y portada:** servicio y ubicación en el `title` del inicio y en una etiqueta sobre el `h1`.
- **Respuestas directas:** un bloque "¿Qué es Kinetika?" en el inicio y uno "¿Qué es…?" por producto (40 a 60 palabras, comprensible sin el resto de la página), con datos de ficha: para quién, estado, dónde y fecha de actualización.
- **Comparaciones:** cada producto trae una tabla (frontmatter `comparison`) que en móvil se apila como tarjetas.
- **Preguntas frecuentes:** en el inicio, en cada producto y en las guías (frontmatter `faq`), todas con `FAQPage`.
- **Fuentes:** las guías citan la norma con enlace al texto oficial (frontmatter `sources`, publicado también como `citation` en `Article`).
- **Datos estructurados:** `ProfessionalService` con catálogo de servicios, temas (`knowsAbout`), logo y zona atendida; `WebSite`; `Service`, `Article` y `BreadcrumbList`.
- **Para asistentes de IA:** `/llms.txt` (resumen con enlaces) y `/llms-full.txt` (productos, preguntas y guías completas en Markdown). Ambos se generan del contenido.
- **Meta robots:** `max-snippet:-1` y `max-image-preview:large` en las páginas indexables.

Fuera del código: Search Console con el sitemap, perfil de empresa en Google, perfiles en directorios con la misma descripción y una revisión mensual de cómo responden los asistentes a las preguntas clave.

## Variables de entorno

| Variable | Uso | Obligatoria |
|---|---|---|
| `RESEND_API_KEY` | Envío de correos | Sí |
| `CONTACT_TO` | Correo que recibe las cotizaciones y la lista de espera | Sí |
| `CONTACT_FROM` | Remitente verificado en Resend | Sí |
| `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Captcha invisible | No |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Límite de envíos compartido | No |

## Pendientes de contenido

- Correo público de contacto (`src/data/site.ts → email`): hoy la política de privacidad indica el formulario como canal.
- Teléfono y perfiles públicos (`phone`, `profiles`): se publican en los datos estructurados solo cuando tengan valor.
- Precios: no se publican hasta definirlos.
- Autor de las guías (nombre y credenciales): pendiente para agregar autoría visible y `author` en `Article`.
