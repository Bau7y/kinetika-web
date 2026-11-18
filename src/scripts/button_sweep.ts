/**
 * Tells the CSS which side the pointer entered a button from, so the hover
 * fill sweeps in from that side. Delegated: one listener for every .btn.
 * Without it the fill simply enters from the left.
 */
export function initButtonSweep() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('pointerover', (e) => {
    const btn = (e.target as Element).closest<HTMLElement>('.btn');
    if (!btn || btn.contains(e.relatedTarget as Node | null)) return;
    const r = btn.getBoundingClientRect();
    btn.dataset.from = e.clientX > r.left + r.width / 2 ? 'right' : 'left';
  });
}
