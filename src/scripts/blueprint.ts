/**
 * Blueprint: picking a requirement (click, or hover with a mouse) highlights
 * its blocks and shows its note.
 */
export function initBlueprint(root: HTMLElement) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-spec]')];
  const blocks = [...root.querySelectorAll<HTMLElement>('[data-block]')];
  const note = root.querySelector<HTMLElement>('[data-proof-note]');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const pick = (button: HTMLButtonElement) => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    const id = button.dataset.spec;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    blocks.forEach((block) => block.toggleAttribute('data-active', block.dataset.block === id));
    if (note) note.textContent = button.dataset.note ?? '';
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => pick(button));
    if (finePointer) button.addEventListener('pointerenter', () => pick(button));
  });
}
