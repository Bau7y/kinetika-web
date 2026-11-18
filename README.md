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
│   ├── favicon.svg
│   └── fonts/                    # solo si alguna fuente no viene de @fontsource
├── scripts/
│   └── a11y.mjs                  # axe sobre el build local
├── src/
│   ├── actions/
│   │   └── index.ts              # acción del chat de cotización (servidor)
│   ├── components/
│   │   ├── brand/
│   │   │   ├── Logo.astro        # K de vidrio en SVG
│   │   │   └── Intro.astro       # la K se arma al cargar
│   │   ├── layout/
│   │   │   ├── NavBar.astro
│   │   │   ├── SkipLink.astro
│   │   │   └── Footer.astro
│   │   ├── sections/             # una sección = un commit
│   │   │   ├── Hero.astro              # 01
│   │   │   ├── SwitchCompare.astro     # 02 el interruptor (antes / después)
│   │   │   ├── DayTimeline.astro       # 03 un día en tu negocio
│   │   │   ├── Blueprint.astro         # 04 este sitio es la prueba
│   │   │   ├── WhyServiceArea.astro    # 05 por qué existimos + dónde atendemos
│   │   │   ├── FaqGuides.astro         # 06 preguntas frecuentes y guías
│   │   │   └── QuoteChat.astro         # 07 cotización conversacional
│   │   └── ui/
│   │       ├── Badge.astro
│   │       ├── Button.astro
│   │       └── JsonLd.astro
│   ├── content/
│   │   ├── guides/               # guías en Markdown (Article)
│   │   └── legal/                # privacidad y aviso legal
│   ├── content.config.ts
│   ├── data/
│   │   ├── site.ts               # nombre, dominio, contacto, redes
│   │   ├── products.ts           # productos y su estado
│   │   ├── day_scenes.ts         # escenas de la línea de tiempo
│   │   ├── service_area.ts       # 13 distritos de San Carlos
│   │   ├── faq.ts                # preguntas frecuentes
│   │   └── pages.ts              # registro único de páginas (sitemap, OG, llms.txt)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── email.ts
│   │   ├── structured_data.ts    # ProfessionalService, FAQPage, Article
│   │   ├── og_image.ts
│   │   └── spam/                 # honeypot, tiempo mínimo, límite por IP, Turnstile, análisis
│   ├── pages/
│   │   ├── index.astro
│   │   ├── guias/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── [legal].astro
│   │   ├── 404.astro
│   │   ├── og/[...slug].png.ts
│   │   ├── robots.txt.ts
│   │   ├── sitemap.xml.ts
│   │   └── llms.txt.ts
│   ├── scripts/                  # JS de cliente por sección
│   │   ├── intro.ts
│   │   ├── switch_compare.ts
│   │   ├── day_timeline.ts
│   │   ├── blueprint.ts
│   │   └── quote_chat.ts
│   └── styles/
│       ├── tokens.css            # paleta, tipografía, espaciado, curvas de animación
│       └── global.css
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

## Plan de trabajo (un commit por sección)

| # | Commit | Contenido |
|---|---|---|
| 0 | `docs: definir stack y estructura del proyecto` | Este README |
| 1 | `chore: configurar Astro, TypeScript y Vercel` | Proyecto base, encabezados, scripts |
| 2 | `feat(ui): agregar tokens de diseño y estilos globales` | Paleta azul empresarial y tipografía |
| 3 | `feat(layout): agregar BaseLayout, navegación y pie` | Esqueleto de la página |
| 4 | `feat(brand): agregar logo e intro de la K` | Animación de carga |
| 5 | `feat(home): agregar hero` | Sección 01 |
| 6 | `feat(home): agregar comparador antes y después` | Sección 02 |
| 7 | `feat(home): agregar línea de tiempo de un día` | Sección 03 |
| 8 | `feat(home): agregar plano anotado del sitio` | Sección 04 |
| 9 | `feat(home): agregar por qué existimos y zonas de atención` | Sección 05 |
| 10 | `feat(home): agregar preguntas frecuentes y guías` | Sección 06 |
| 11 | `feat(contact): agregar cotización conversacional` | Sección 07 y acción de servidor |
| 12 | `feat(seo): agregar datos estructurados, sitemap y OG` | SEO técnico |
| 13 | `test: agregar pruebas unitarias, de humo y accesibilidad` | Calidad |

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
| `yarn test:a11y` | Accesibilidad con axe |

## Variables de entorno

| Variable | Uso | Obligatoria |
|---|---|---|
| `RESEND_API_KEY` | Envío de correos | Sí |
| `CONTACT_TO` | Correo que recibe las cotizaciones | Sí |
| `CONTACT_FROM` | Remitente verificado en Resend | Sí |
| `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Captcha invisible | No |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Límite de envíos compartido | No |
