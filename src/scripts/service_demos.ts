/**
 * The mini demos inside the service cards only run while their card is on
 * screen: an IntersectionObserver toggles [data-live] and the CSS pauses
 * every animation otherwise (nothing animates off screen, no scroll listener).
 */
export function initServiceDemos() {
  const cards = document.querySelectorAll<HTMLElement>('.service');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.toggleAttribute('data-live', entry.isIntersecting);
  });
  cards.forEach((card) => observer.observe(card));
}
