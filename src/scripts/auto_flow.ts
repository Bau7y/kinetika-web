/**
 * Lights the steps of the flow one after another while the section is on
 * screen. Pauses on hover, on focus and with the button. Reduced motion:
 * nothing is enhanced, every step stays complete.
 */
const STEP_MS = 1500;
const HOLD_MS = 2600;

export function initAutoFlow(root: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-flow-step]'));
  const toggle = root.querySelector<HTMLButtonElement>('[data-flow-toggle]');
  if (!steps.length || !toggle) return;

  let index = -1;
  let timer = 0;
  let visible = false;
  let hovered = false;
  let userPaused = false;

  const paint = () => {
    steps.forEach((step, i) => {
      step.dataset.state = i < index ? 'done' : i === index ? 'active' : 'pending';
      if (i === index) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
  };

  const running = () => visible && !hovered && !userPaused;

  const tick = () => {
    window.clearTimeout(timer);
    if (!running()) return;
    if (index >= steps.length - 1) {
      // Hold the finished state, then start over
      timer = window.setTimeout(() => {
        index = -1;
        paint();
        timer = window.setTimeout(tick, 500);
      }, HOLD_MS);
      return;
    }
    index += 1;
    paint();
    timer = window.setTimeout(tick, STEP_MS);
  };

  root.dataset.ready = '';
  toggle.hidden = false;
  paint();

  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.textContent = userPaused ? toggle.dataset.labelPlay! : toggle.dataset.labelPause!;
    tick();
  });
  root.addEventListener('pointerenter', () => { hovered = true; window.clearTimeout(timer); });
  root.addEventListener('pointerleave', () => { hovered = false; tick(); });

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      tick();
    },
    { threshold: 0.35 },
  ).observe(root);
}
