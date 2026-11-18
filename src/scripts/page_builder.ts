/**
 * Page builder: toggling a section grows or shrinks the skeleton page, and
 * the blocks around it slide to their new place (FLIP). Presets rebuild the
 * page block by block. Only opacity and transform are animated.
 */
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

export function initPageBuilder(root: HTMLElement) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inputs = [...root.querySelectorAll<HTMLInputElement>('[data-section-input]')];
  const presets = [...root.querySelectorAll<HTMLButtonElement>('[data-preset]')];
  const plan = root.querySelector<HTMLElement>('[data-plan]')!;
  const answer = root.querySelector<HTMLElement>('[data-answer]')!;
  const count = root.querySelector<HTMLElement>('[data-count]')!;
  const blocks = new Map<string, HTMLElement>();
  plan.querySelectorAll<HTMLElement>('[data-block]').forEach((b) => blocks.set(b.dataset.block!, b));
  const answerTemplate = root.dataset.answersTemplate ?? '{q}';
  const countTemplate = root.dataset.countTemplate ?? '{n}/{total}';
  const total = Number(root.dataset.total ?? blocks.size);

  const visibleBlocks = () => [...blocks.values()].filter((b) => !b.hidden);
  const cancel = (el: Element) => el.getAnimations().forEach((a) => a.cancel());

  const updateCount = () => {
    const n = inputs.filter((i) => i.checked).length;
    count.textContent = countTemplate.replace('{n}', String(n)).replace('{total}', String(total));
  };

  const say = (id: string) => {
    const q = root.querySelector<HTMLElement>(`[data-chip="${id}"]`)?.dataset.question ?? '';
    answer.textContent = answerTemplate.replace('{q}', q);
  };

  /** Blocks that stay visible slide from where they were to where they are now. */
  const flip = (first: Map<HTMLElement, number>, skip?: HTMLElement) => {
    if (reduce) return;
    first.forEach((top, el) => {
      if (el === skip || el.hidden) return;
      const dy = top - el.getBoundingClientRect().top;
      if (Math.abs(dy) < 1) return;
      el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 300, easing: EASE });
    });
  };

  const snapshot = () => {
    const m = new Map<HTMLElement, number>();
    visibleBlocks().forEach((b) => {
      cancel(b);
      m.set(b, b.getBoundingClientRect().top);
    });
    return m;
  };

  const enter = (el: HTMLElement, delay = 0) => {
    if (reduce) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(14px) scale(0.98)' }, { opacity: 1, transform: 'none' }],
      { duration: 320, delay, easing: EASE, fill: 'backwards' },
    );
  };

  const show = (id: string) => {
    const el = blocks.get(id);
    if (!el) return;
    const first = snapshot();
    el.hidden = false;
    enter(el);
    flip(first, el);
    el.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  };

  const hide = (id: string) => {
    const el = blocks.get(id);
    if (!el || el.hidden) return;
    if (reduce) {
      el.hidden = true;
      return;
    }
    cancel(el);
    el.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(0.98)' }], { duration: 160, easing: EASE, fill: 'forwards' }).finished
      .then(() => {
        const first = snapshot();
        first.delete(el);
        el.hidden = true;
        cancel(el);
        flip(first);
      })
      .catch(() => {});
  };

  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      input.checked ? show(input.value) : hide(input.value);
      say(input.value);
      updateCount();
      presets.forEach((p) => p.setAttribute('aria-pressed', 'false'));
    });
    input.closest('label')?.addEventListener('pointerenter', () => say(input.value));
    input.addEventListener('focus', () => say(input.value));
  });

  /** Rebuilds the whole page: unwanted blocks go away, wanted ones come in one by one. */
  const applyPreset = (ids: string[]) => {
    const wanted = new Set(ids);
    inputs.forEach((i) => (i.checked = wanted.has(i.value)));
    blocks.forEach((el, id) => {
      cancel(el);
      el.hidden = !wanted.has(id);
    });
    plan.scrollTo({ top: 0 });
    visibleBlocks().forEach((el, i) => enter(el, i * 80));
    updateCount();
  };

  presets.forEach((button) => {
    button.addEventListener('click', () => {
      presets.forEach((p) => p.setAttribute('aria-pressed', String(p === button)));
      applyPreset(button.dataset.sections!.split(','));
      answer.textContent = '';
    });
  });

  // First time on screen the page builds itself
  const first = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      first.disconnect();
      const active = presets.find((p) => p.getAttribute('aria-pressed') === 'true');
      if (active) applyPreset(active.dataset.sections!.split(','));
    },
    { threshold: 0.4 },
  );
  first.observe(plan);
}
