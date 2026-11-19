/**
 * Card tilt: on hover a [data-lift] card rises and leans toward the pointer,
 * the side under the cursor coming forward, and then loosely follows it.
 * The angles go into CSS variables (CSSOM, so the CSP stays intact) and the
 * transform itself is declared in global.css. Mouse only: on touch screens
 * and with reduced motion the cards stay still.
 */
const MAX_TILT = 5; // degrees at the very edge

export function initCardTilt() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-lift]').forEach((card) => {
    let rect: DOMRect | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      if (!rect) return;
      const nx = Math.max(-1, Math.min(1, (x - rect.left) / rect.width * 2 - 1));
      const ny = Math.max(-1, Math.min(1, (y - rect.top) / rect.height * 2 - 1));
      card.style.setProperty('--tilt_x', `${(ny * MAX_TILT).toFixed(2)}deg`);
      card.style.setProperty('--tilt_y', `${(-nx * MAX_TILT).toFixed(2)}deg`);
    };

    const schedule = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    card.addEventListener('pointerenter', (e) => {
      rect = card.getBoundingClientRect();
      card.classList.add('lift_ready');
      // Tilt toward the entry side first, then lift, so it rises from there
      schedule(e);
      requestAnimationFrame(() => card.classList.add('lift_on'));
    });
    card.addEventListener('pointermove', schedule);
    card.addEventListener('pointerleave', () => {
      rect = null;
      cancelAnimationFrame(frame);
      frame = 0;
      card.classList.remove('lift_on');
      card.style.setProperty('--tilt_x', '0deg');
      card.style.setProperty('--tilt_y', '0deg');
    });
  });
}
