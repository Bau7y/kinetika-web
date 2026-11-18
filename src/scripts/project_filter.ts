/**
 * Status filter of the projects index. Shows the toolbar only when the
 * script runs (without it every project stays listed), toggles `hidden` on
 * the cards and announces the count in the live region.
 */
export function initProjectFilter() {
  const bar = document.querySelector<HTMLElement>('[data-project-filter]');
  const count = document.querySelector<HTMLElement>('[data-project-count]');
  if (!bar || !count) return;
  const cards = [...document.querySelectorAll<HTMLElement>('li[data-status]')];
  const buttons = [...bar.querySelectorAll<HTMLButtonElement>('button[data-status]')];
  bar.hidden = false;

  const apply = (status: string) => {
    let shown = 0;
    for (const card of cards) {
      const visible = status === 'all' || card.dataset.status === status;
      card.hidden = !visible;
      if (visible) shown++;
    }
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.status === status));
    count.textContent = shown === 1 ? count.dataset.one! : count.dataset.many!.replace('{n}', String(shown));
  };

  bar.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-status]');
    if (button) apply(button.dataset.status!);
  });
}
