/**
 * Before/after comparator. The range value (0–100) is how much of the
 * "today" layer stays visible. Only clip-path and transform change: no layout.
 */
export function initSwitchCompare(root: HTMLElement) {
  const section = root.closest('section')!;
  const range = section.querySelector<HTMLInputElement>('[data-compare-range]');
  const before = root.querySelector<HTMLElement>('[data-compare-before]');
  const handle = root.querySelector<HTMLElement>('[data-compare-handle]');
  if (!range || !before || !handle) return;

  const template = root.dataset.valueTemplate ?? '{before}';

  const render = (value: number) => {
    before.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    handle.style.transform = `translateX(${value}%)`;
    // Almost hidden: screen readers skip the "today" layer
    before.setAttribute('aria-hidden', String(value < 5));
    range.setAttribute('aria-valuetext', template.replace('{before}', String(value)).replace('{after}', String(100 - value)));
  };

  // On narrow screens both layers span the full width: start by showing "today" whole
  if (!matchMedia('(min-width: 860px)').matches) range.value = '100';

  range.addEventListener('input', () => render(Number(range.value)));
  render(Number(range.value));
}
