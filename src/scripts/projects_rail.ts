/**
 * Projects rail: one panel open at a time. Hover (with a short intent delay),
 * focus or tap opens a strip; arrow keys move between strips. Closed panels
 * are `inert` so their link never takes focus.
 */
export function initProjectsRail(rail: HTMLElement) {
  const panels = [...rail.querySelectorAll<HTMLElement>('[data-panel]')];
  const tabs = panels.map((p) => p.querySelector<HTMLButtonElement>('.rail_tab')!);
  const bodies = panels.map((p) => p.querySelector<HTMLElement>('.rail_body')!);
  let timer: number | undefined;

  const open = (index: number) => {
    rail.dataset.active = String(index);
    tabs.forEach((tab, i) => tab.setAttribute('aria-expanded', String(i === index)));
    bodies.forEach((body, i) => body.toggleAttribute('inert', i !== index));
  };

  rail.dataset.ready = '';
  open(0);

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => open(i));
    tab.addEventListener('focus', () => open(i));
    tab.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => open(i), 90);
    });
    tab.addEventListener('pointerleave', () => window.clearTimeout(timer));
    tab.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      tabs[(i + step + tabs.length) % tabs.length].focus();
    });
  });
}
