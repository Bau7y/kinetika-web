# DESIGN.md — Kinetika

Sistema visual del sitio. Los valores viven en `src/styles/tokens.css`; este documento explica las decisiones.

## Dirección

Landing cinematográfica y minimalista, solo modo oscuro, azul empresarial. Poco contenido por pantalla, mucho espacio, bordes finos en lugar de cajas y un único acento. Inspiración: plantilla Sonotype de SiteReel (referencia de estilo, no se copia).

Modo de la superficie: **Persuade** (home y soluciones). Las guías y la documentación son **Read**.

## Principios

1. **Una idea por sección.** Titular, una línea de apoyo, una acción.
2. **Líneas, no cajas.** Las secciones se separan con una línea fina (`--color_line`); los servicios son columnas abiertas; los paneles de proyecto solo llevan borde.
3. **Un acento.** `--color_accent` (#3d8bff) para énfasis y enlaces. El estado se comunica con forma y texto, nunca solo con color.
4. **Movimiento con propósito.** Solo `transform` y `opacity`. Todo respeta `prefers-reduced-motion` y el hover se limita a `(hover: hover) and (pointer: fine)`.
5. **El h1 nunca se anima** (es el LCP).

## Color

| Token | Valor | Uso |
|---|---|---|
| `--color_bg` | #070b14 | Fondo de página |
| `--color_surface` / `--color_raised` | #0d1422 / #111a2b | Superficies elevadas puntuales (menús, avisos) |
| `--color_line` / `--color_line_strong` | #1c2536 / #2b3650 | Separadores y bordes |
| `--color_text` / `_secondary` / `_muted` | #e8eef7 / #b4c0d3 / #94a3b8 | Jerarquía de texto |
| `--color_accent` / `--color_accent_text` | #3d8bff / #6ea8ff | Énfasis, enlaces |
| `--color_cta` | #2f6feb | Botón primario |

## Tipografía

- Sans: Plus Jakarta Sans Variable. Énfasis con color (`--color_accent_text`), no con otra familia.
- Mono: Geist Mono Variable, solo para etiquetas de sección y numeración.
- Escala: `--text_display` (hero), `--text_h2`, `--text_h3`, `--text_base`… Titulares con `letter-spacing: -0.03em` a `-0.04em`.

## Layout

- Contenedor `--container_max` 1240 px, padding lateral 24 px.
- Ritmo vertical: `--section_py` (5 a 8.5 rem).
- Barra de navegación flotante (`--navbar_h` 88 px), con efecto de vidrio.

## Componentes

- **Botones** (`.btn`): píldora (`--radius_full`), peso 500. Primario azul con barrido claro al hover; fantasma con borde.
- **Hero:** texto a la izquierda, la K del logo grande a la derecha sobre líneas animadas.
- **Servicios:** dos columnas abiertas con línea superior; la línea se vuelve azul al hover.
- **Proyectos:** panel abierto más tiras verticales; borde fino, sin relleno.
- **FAQ:** lista con líneas finas y marcador activo.
- **Cierre (`ClosingCta`):** titular centrado y dos botones.

## Movimiento

Curvas `--ease_out` y `--ease_in_out`; duraciones `--duration_press` 160 ms a `--duration_slow` 600 ms. Las salidas duran cerca del 70 % de la entrada. Revelado al desplazar con `data-reveal` y retraso escalonado `data-i`.

## Reglas de contenido

- Español neutro, trato de usted, sin voseo.
- Sin cifras ni testimonios inventados; solo hechos verificables.
- Identificadores de código en inglés; CSS en `snake_case` con un solo guion bajo, sin BEM.
