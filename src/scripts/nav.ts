/**
 * Nav interactivity that must work regardless of motion preference:
 *  - transparent -> navy background on scroll
 *  - top scroll-progress bar fill (the signature gradient)
 *  - mobile menu open/close (+ a11y state, Escape, click-out, link close)
 *  - language toggle keeps the current section hash when switching locale
 */
export function initNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  const progress = nav.querySelector<HTMLElement>('[data-progress]');
  const burger = nav.querySelector<HTMLButtonElement>('[data-burger]');
  const mobile = document.querySelector<HTMLElement>('[data-mobile]');

  // --- scroll state + progress ---
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
    ticking = false;
  };
  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  };
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  onScroll();

  // --- mobile menu ---
  if (burger && mobile) {
    const openLabel = burger.getAttribute('aria-label') || 'Open menu';
    const closeLabel = mobile.getAttribute('data-close-label') || openLabel;

    const setOpen = (open: boolean) => {
      burger.setAttribute('aria-expanded', String(open));
      if (open) {
        mobile.hidden = false;
      } else {
        mobile.hidden = true;
      }
      burger.setAttribute('aria-label', open ? closeLabel : openLabel);
    };

    burger.addEventListener('click', () => {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    mobile.querySelectorAll('[data-mobile-link]').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        burger.focus();
      }
    });
  }

  // --- language toggle: preserve current section hash across locales ---
  document.querySelectorAll<HTMLAnchorElement>('[data-locale-switch]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.location.hash) {
        link.href = link.getAttribute('href')!.replace(/#.*$/, '') + window.location.hash;
      }
    });
  });
}
