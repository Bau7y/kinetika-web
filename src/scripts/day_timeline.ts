/**
 * Day timeline. The track moves one scene at a time; the offset is computed
 * by CSS (card width + gap), so no layout is read.
 *
 * Auto tour: the current segment's fill is a CSS animation; when it ends,
 * the next scene comes (and after the last one, the first). The animation
 * pauses while any reason to pause holds: hover, focus inside, off screen,
 * hidden tab, the pause button or reduced motion (until the visitor presses
 * play). Auto moves are not announced; manual ones are.
 */
export function initDayTimeline(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-day-track]');
  const scenes = [...root.querySelectorAll<HTMLElement>('[data-day-scene]')];
  const segs = [...root.querySelectorAll<HTMLButtonElement>('[data-day-seg]')];
  const prev = root.querySelector<HTMLButtonElement>('[data-day-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-day-next]');
  const play = root.querySelector<HTMLButtonElement>('[data-day-play]');
  const live = root.querySelector<HTMLElement>('[data-day-live]');
  if (!track || !prev || !next || scenes.length === 0) return;

  const hours = scenes.map((s) => s.querySelector('.day_hour')?.textContent ?? '');
  const names = scenes.map((s) => s.querySelector('h3')?.textContent ?? '');
  let index = 0;

  const go = (to: number, announce = true) => {
    index = (to + scenes.length) % scenes.length;
    track.style.transform = `translateX(calc(${-index} * (var(--card_w) + var(--gap))))`;
    scenes.forEach((scene, i) => (i === index ? scene.setAttribute('aria-current', 'step') : scene.removeAttribute('aria-current')));
    segs.forEach((seg, i) => {
      seg.toggleAttribute('data-done', i < index);
      if (i === index) seg.setAttribute('aria-current', 'step');
      else seg.removeAttribute('aria-current');
    });
    if (live && announce) live.textContent = `${hours[index]}, ${names[index]}`;
  };

  // ── Pause reasons ──
  const reasons = new Set<string>();
  const setPaused = (reason: string, on: boolean) => {
    if (on) reasons.add(reason);
    else reasons.delete(reason);
    const paused = reasons.size > 0;
    root.toggleAttribute('data-paused', paused);
    if (play) {
      const byUser = reasons.has('user') || reasons.has('reduce');
      play.setAttribute('aria-pressed', String(byUser));
      play.setAttribute('aria-label', (byUser ? play.dataset.labelPlay : play.dataset.labelPause) ?? '');
    }
  };

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused('reduce', true);

  play?.addEventListener('click', () => {
    const resume = reasons.has('user') || reasons.has('reduce');
    setPaused('reduce', false);
    setPaused('user', !resume);
  });

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    root.addEventListener('pointerenter', () => setPaused('hover', true));
    root.addEventListener('pointerleave', () => setPaused('hover', false));
  }
  root.addEventListener('focusin', () => setPaused('focus', true));
  root.addEventListener('focusout', (e) => !root.contains(e.relatedTarget as Node | null) && setPaused('focus', false));
  new IntersectionObserver(([entry]) => setPaused('offscreen', !entry.isIntersecting), { threshold: 0.35 }).observe(root);
  document.addEventListener('visibilitychange', () => setPaused('hidden', document.hidden));

  // The fill of the current segment finished: next scene
  root.addEventListener('animationend', (e) => {
    const fill = e.target as HTMLElement;
    if (fill.classList.contains('day_seg_fill') && segs[index]?.contains(fill)) go(index + 1, false);
  });

  // ── Manual control ──
  // Keyboard users tabbing into another scene: bring that scene into view
  scenes.forEach((scene, i) => scene.addEventListener('focusin', () => i !== index && go(i)));
  segs.forEach((seg, i) => seg.addEventListener('click', () => go(i)));
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  go(0, false);
}
