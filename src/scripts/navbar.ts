/**
 * Pill navigation: denser glass after scrolling, sliding highlight with
 * scroll spy and dock-style magnification (wide screens) and the panel with
 * focus handling and a locked page behind it (narrow screens). Markup in components/layout/NavBar.astro and NavPanel.astro.
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
  let boxes: { left: number; right: number; center: number }[] = [];
  const measure = () => {
    const width = list.offsetWidth;
    boxes = links.map((a) => {
      const li = a.parentElement!;
      return {
        left: li.offsetLeft,
        right: width - li.offsetLeft - li.offsetWidth,
        center: li.offsetLeft + li.offsetWidth / 2,
      };
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

  // ResizeObserver callbacks run right after layout, so reading offsets there
  // forces nothing. Watching every item also covers a font swap that resizes
  // the links, which is why measure() is not called from document.fonts.ready
  // (that runs while styles are still dirty and forces a reflow).
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(list);
  links.forEach((a) => resizeObserver.observe(a.parentElement!));

  if (finePointer) {
    links.forEach((a, i) => a.addEventListener('pointerenter', () => paint(i)));
    list.addEventListener('pointerleave', () => paint(active));
  }

  /* ── Magnification: links grow with the pointer's distance, like a dock.
     The scale goes in --mag on each link and on its highlight copy, so both
     stay aligned. Positions come from measure(): nothing is read while moving. ── */
  const marks = [...highlight.querySelectorAll<HTMLElement>('span')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (finePointer && !reduceMotion.matches) {
    const GROW = 0.2; // largest extra scale, under the pointer
    const REACH = 120; // px at which the effect fades out
    let pointerX = 0;
    let listLeft = 0;
    let queued = false;

    const setScale = (i: number, value: number) => {
      const v = value.toFixed(3);
      links[i].style.setProperty('--mag', v);
      marks[i]?.style.setProperty('--mag', v);
    };
    const update = () => {
      queued = false;
      boxes.forEach((box, i) => {
        const k = Math.max(0, 1 - Math.abs(pointerX - box.center) / REACH);
        setScale(i, 1 + GROW * k * k * (3 - 2 * k)); // smoothstep falloff
      });
    };

    list.addEventListener('pointerenter', (e) => {
      listLeft = list.getBoundingClientRect().left;
      pointerX = e.clientX - listLeft;
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    });
    list.addEventListener('pointermove', (e) => {
      pointerX = e.clientX - listLeft;
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    });
    list.addEventListener('pointerleave', () => {
      queued = false;
      links.forEach((_, i) => setScale(i, 1));
    });
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
     inert (no taps, no focus), the page behind does not scroll (html.menu_lock)
     and the blurred veil takes the taps: touching it closes the menu. Escape
     closes it and returns focus. ── */
  const scrim = navbar.querySelector<HTMLElement>('[data-menu-scrim]');
  const outside = () => document.querySelectorAll<HTMLElement>('body > :not(header):not(script)');

  const setMenuOpen = (isOpen: boolean) => {
    if (isOpen === mobileMenu.classList.contains('open')) return;
    mobileMenu.classList.toggle('open', isOpen);
    menuButton.classList.toggle('open', isOpen);
    navbar.classList.toggle('menu_open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', (isOpen ? menuButton.dataset.labelClose : menuButton.dataset.labelOpen) ?? '');
    outside().forEach((el) => el.toggleAttribute('inert', isOpen));
    document.documentElement.classList.toggle('menu_lock', isOpen);
    if (isOpen) mobileMenu.querySelector<HTMLElement>('a')?.focus();
  };

  menuButton.addEventListener('click', () => setMenuOpen(!mobileMenu.classList.contains('open')));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenuOpen(false)));
  scrim?.addEventListener('click', () => setMenuOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
  matchMedia('(min-width: 1080px)').addEventListener('change', (e) => e.matches && setMenuOpen(false));
}
