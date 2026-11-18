/**
 * FAQ panel: one question open at a time. Arrow keys, Home and End move
 * between the questions and open them. Reduced motion: no entrance animation.
 */
export function initFaqPanel(root: HTMLElement) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-faq-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-faq-panel-body]')];
  if (!tabs.length || tabs.length !== panels.length) return;

  const open = (index: number, focus = false) => {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-expanded', String(on));
      panels[i].hidden = !on;
      tab.hidden = false;
    });
    if (!reduce) {
      panels[index].animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );
    }
    if (focus) tabs[index].focus();
  };

  root.dataset.ready = '';
  tabs.forEach((tab) => (tab.hidden = false));
  panels.forEach((panel, i) => (panel.hidden = i !== 0));

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      // On narrow screens the same question closes when pressed again
      if (tab.getAttribute('aria-expanded') === 'true' && !matchMedia('(min-width: 900px)').matches) {
        tab.setAttribute('aria-expanded', 'false');
        panels[i].hidden = true;
        return;
      }
      open(i);
    });
    tab.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      const next =
        e.key === 'ArrowDown' ? (i === last ? 0 : i + 1)
        : e.key === 'ArrowUp' ? (i === 0 ? last : i - 1)
        : e.key === 'Home' ? 0
        : e.key === 'End' ? last
        : -1;
      if (next < 0) return;
      e.preventDefault();
      open(next, true);
    });
  });
}
