/**
 * Spotlight: a soft light that follows the mouse inside [data-spotlight]
 * cards. The light is one element moved with transform (compositor only);
 * it fades in on enter and out on leave. Mouse only: no effect on touch.
 */
export function initSpotlight() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
    const light = document.createElement('span');
    light.className = 'spotlight';
    light.setAttribute('aria-hidden', 'true');
    card.prepend(light);

    let rect: DOMRect | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;

    card.addEventListener('pointerenter', () => {
      rect = card.getBoundingClientRect();
      card.classList.add('spotlight_on');
    });
    card.addEventListener('pointermove', (e) => {
      if (!rect) return;
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          light.style.transform = `translate(${x}px, ${y}px)`;
        });
      }
    });
    card.addEventListener('pointerleave', () => {
      rect = null;
      card.classList.remove('spotlight_on');
    });
  });
}
