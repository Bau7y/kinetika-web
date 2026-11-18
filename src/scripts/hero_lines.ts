/**
 * Starts the live hero lines once the page is idle, so the first paint and
 * the LCP never wait for them. The static image stays underneath until the
 * first live frame is ready, then they cross-fade.
 *
 * Skipped (the static image remains) when the visitor prefers reduced motion,
 * on slow connections or where OffscreenCanvas is not supported.
 */
export function initHeroLines(hero: HTMLElement) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (reduce || saveData || !('transferControlToOffscreen' in HTMLCanvasElement.prototype)) return;

  const start = () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero_lines';
    canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);

    const worker = new Worker(new URL('./hero_lines.worker.ts', import.meta.url), { type: 'module' });
    const offscreen = canvas.transferControlToOffscreen();
    // Soft lines need no full retina resolution; the worker lowers it further
    // on big screens to keep a fixed pixel budget per frame
    const dpr = Math.min(devicePixelRatio || 1, 1.25);

    worker.addEventListener('message', (e: MessageEvent<{ type: string }>) => {
      if (e.data.type === 'ready') hero.classList.add('lines_live');
    });

    // The observer hands over the size after the browser's own layout, so
    // nothing here reads clientWidth/clientHeight (that forces a reflow right
    // after the canvas is inserted). Its first callback also starts the worker.
    let width = 0;
    let height = 0;
    let started = false;
    // Messages that arrive before the first size are held back: the worker
    // needs 'init' (and its canvas) before it can play, pause or steer
    const pending: object[] = [];
    const post = (msg: object) => {
      if (started) worker.postMessage(msg);
      else pending.push(msg);
    };
    new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      const w = Math.round(box.width);
      const h = Math.round(box.height);
      if (started && w === width && h === height) return;
      width = w;
      height = h;
      if (started) {
        post({ type: 'resize', width, height });
        return;
      }
      worker.postMessage({ type: 'init', canvas: offscreen, width, height, dpr }, [offscreen]);
      started = true;
      pending.splice(0).forEach((msg) => worker.postMessage(msg));
    }).observe(hero);

    // Only runs while the hero is on screen and the tab is visible
    let onScreen = true;
    const sync = () => post({ type: onScreen && !document.hidden ? 'play' : 'pause' });
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    }).observe(hero);
    document.addEventListener('visibilitychange', sync);
    sync();

    // Scroll story without scroll listeners: how much of the hero has left the
    // viewport (0 → 1) drives the lines from loose to ordered
    const steps = Array.from({ length: 41 }, (_, i) => i / 40);
    // Hero position, refreshed by the observer: the pointer handler never
    // reads layout (no getBoundingClientRect on every move)
    let heroTop = 0;
    new IntersectionObserver(
      ([entry]) => {
        heroTop = entry.boundingClientRect.top;
        const leaving = heroTop < 0;
        post({ type: 'progress', value: leaving ? Math.min(1, (1 - entry.intersectionRatio) * 1.6) : 0 });
      },
      { threshold: steps },
    ).observe(hero);

    // Lines lean toward a mouse pointer (not touch: scrolling would drag them)
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let queued = false;
      let last = { x: 0.5, y: 0.5, inside: false };
      const send = () => {
        queued = false;
        post({ type: 'pointer', ...last });
      };
      hero.addEventListener('pointermove', (e) => {
        if (!width || !height) return;
        last = { x: e.clientX / width, y: (e.clientY - heroTop) / height, inside: true };
        if (!queued) {
          queued = true;
          requestAnimationFrame(send);
        }
      });
      hero.addEventListener('pointerleave', () => {
        last = { ...last, inside: false };
        send();
      });
    }
  };

  const idle = (cb: () => void) =>
    'requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200);
  if (document.readyState === 'complete') idle(start);
  else addEventListener('load', () => idle(start), { once: true });
}
