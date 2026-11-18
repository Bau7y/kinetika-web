/**
 * Pill navigation: solid state after scrolling, sliding highlight with
 * scroll spy (wide screens) and the panel with focus handling (narrow
 * screens). Markup in components/layout/NavBar.astro and NavPanel.astro.
 */
export function initNavbar() {
  const navbar = document.querySelector<HTMLElement>('[data-navbar]');
  if (!navbar) return;
  const menuButton = navbar.querySelector<HTMLButtonElement>('[data-menu-toggle]')!;
  const mobileMenu = navbar.querySelector<HTMLElement>('[data-mobile-menu]')!;

  /* More solid after scrolling. A sentinel at the top of the page:
     no scroll listener and no geometry reads, so no forced layout. */
  const sentinel = document.querySelector<HTMLElement>('[data-scroll-sentinel]')!;
  new IntersectionObserver(([entry]) => navbar.classList.toggle('scrolled', !entry.isIntersecting)).observe(sentinel);

  /* ── Sliding highlight (wide screens) ── */
  const list = navbar.querySelector<HTMLElement>('[data-pill-links]')!;
  const highlight = navbar.querySelector<HTMLElement>('[data-pill-highlight]')!;
  const links = [...list.querySelectorAll<HTMLAnchorElement>('a')];
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Link boxes, measured only when the layout changes (load, resize, fonts)
  let boxes: { left: number; right: number }[] = [];
  const measure = () => {
    const width = list.offsetWidth;
    boxes = links.map((a) => {
      const li = a.parentElement!;
      return { left: li.offsetLeft, right: width - li.offsetLeft - li.offsetWidth };
    });
    paint(shown, false);
  };

  let active = links.findIndex((a) => a.getAttribute('aria-current') === 'page');
  let shown = active;

  /** Clips the highlight to link `index` (-1 hides it). */
  function paint(index: number, animate = true) {
    shown = index;
    highlight.classList.toggle('no_motion', !animate);
    const box = boxes[index];
    if (index < 0 || !box) {
      highlight.classList.remove('is_on');
      return;
    }
    highlight.style.clipPath = `inset(0 ${box.right}px 0 ${box.left}px round 999px)`;
    highlight.classList.add('is_on');
  }

  new ResizeObserver(measure).observe(list);
  document.fonts?.ready.then(measure);

  if (finePointer) {
    links.forEach((a, i) => a.addEventListener('pointerenter', () => paint(i)));
    list.addEventListener('pointerleave', () => paint(active));
  }

  // Scroll spy: the section crossing the middle of the viewport
  const sections = links
    .map((a, i) => ({ i, el: a.dataset.section ? document.getElementById(a.dataset.section) : null }))
    .filter((s): s is { i: number; el: HTMLElement } => s.el !== null);
  if (sections.length > 0) {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const match = sections.find((s) => s.el === entry.target);
          if (!match) continue;
          if (entry.isIntersecting) active = match.i;
          else if (active === match.i) active = -1;
        }
        if (!list.matches(':hover')) paint(active);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => spy.observe(s.el));
  }

  /* ── Panel (narrow screens). While open, everything outside the header is
     inert: focus stays in the menu. Escape closes it and returns focus. ── */
  const outside = () => document.querySelectorAll<HTMLElement>('body > :not(header):not(script)');

  const setMenuOpen = (isOpen: boolean) => {
    if (isOpen === mobileMenu.classList.contains('open')) return;
    mobileMenu.classList.toggle('open', isOpen);
    menuButton.classList.toggle('open', isOpen);
    navbar.classList.toggle('menu_open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', (isOpen ? menuButton.dataset.labelClose : menuButton.dataset.labelOpen) ?? '');
    outside().forEach((el) => el.toggleAttribute('inert', isOpen));
    if (isOpen) mobileMenu.querySelector<HTMLElement>('a')?.focus();
  };

  menuButton.addEventListener('click', () => setMenuOpen(!mobileMenu.classList.contains('open')));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
  matchMedia('(min-width: 1080px)').addEventListener('change', (e) => e.matches && setMenuOpen(false));
}
