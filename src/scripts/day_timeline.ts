/**
 * Day timeline: prev/next move the track one card at a time. The offset is
 * computed by CSS (card width + gap), so no layout is read.
 */
export function initDayTimeline(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-day-track]');
  const scenes = [...root.querySelectorAll<HTMLElement>('[data-day-scene]')];
  const prev = root.querySelector<HTMLButtonElement>('[data-day-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-day-next]');
  const fill = root.querySelector<HTMLElement>('[data-day-fill]');
  const label = root.querySelector<HTMLElement>('[data-day-label]');
  const live = root.querySelector<HTMLElement>('[data-day-live]');
  if (!track || !prev || !next || scenes.length === 0) return;

  const hours = scenes.map((s) => s.querySelector('.day_hour')?.textContent ?? '');
  const names = scenes.map((s) => s.querySelector('h3')?.textContent ?? '');
  const lastHour = hours[hours.length - 1];
  let index = 0;

  const go = (to: number, announce = true) => {
    index = Math.max(0, Math.min(scenes.length - 1, to));
    track.style.transform = `translateX(calc(${-index} * (var(--card_w) + var(--gap))))`;
    scenes.forEach((scene, i) => (i === index ? scene.setAttribute('aria-current', 'step') : scene.removeAttribute('aria-current')));
    prev.setAttribute('aria-disabled', String(index === 0));
    next.setAttribute('aria-disabled', String(index === scenes.length - 1));
    if (fill) fill.style.transform = `scaleX(${(index + 1) / scenes.length})`;
    if (label) label.textContent = `${hours[index]} / ${lastHour}`;
    if (live && announce) live.textContent = `${hours[index]}, ${names[index]}`;
  };

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  go(0, false);
}
