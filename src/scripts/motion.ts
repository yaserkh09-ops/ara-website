/**
 * Motion system — runs ONLY when <html> has `.motion`
 * (JS present AND prefers-reduced-motion: no-preference).
 *
 * Everything degrades gracefully: with reduced motion or no JS, the page is
 * fully rendered and static (reveals visible, motif lit, mechanism unlocked,
 * steps stacked) because all hidden/initial states are CSS-scoped to `.motion`.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function initMotion(): void {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  try {
    gsap.registerPlugin(ScrollTrigger);
    const rtl = root.dir === 'rtl';

    // ---- Smooth scroll (Lenis) synced to GSAP/ScrollTrigger ----
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Smooth in-page anchor jumps (respect fixed nav height).
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      a.addEventListener('click', (e) => {
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.1 });
        if (history.replaceState) history.replaceState(null, '', id);
      });
    });

    initReveals();
    initParallax();
    initHeroMotif(rtl);
    initMechanism();
    initStepThrough();

    window.addEventListener('load', () => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 400);

    // Safety net: anything in view but somehow still hidden gets revealed.
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
      });
    }, 1200);
  } catch (err) {
    // If anything goes wrong, never leave content hidden.
    revealAll();
    // eslint-disable-next-line no-console
    console.warn('[motion] disabled after error:', err);
  }
}

function revealAll(): void {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
}

/* Gentle scroll parallax for elements tagged [data-parallax] (hero glows). */
function initParallax(): void {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0');
    if (!speed) return;
    gsap.to(el, {
      y: speed * 280,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  });
}

/* Sequential rise+fade reveals; grouped elements stagger together. */
function initReveals(): void {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (batch) =>
      batch.forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = `${Math.min(i, 8) * 90}ms`;
        el.classList.add('is-visible');
      }),
  });
}

/* §1 — "the shelf becomes visible." */
function initHeroMotif(rtl: boolean): void {
  const motif = document.querySelector<HTMLElement>('#hero-motif');
  if (!motif) return;

  motif.classList.add('is-dim');

  const panel = motif.querySelector<HTMLElement>('.motif__panel');
  const conn = motif.querySelector<SVGPathElement>('[data-connector]');
  const nodes = motif.querySelectorAll<HTMLElement>('[data-node]');
  const tiles = motif.querySelectorAll<HTMLElement>('[data-tile]');

  const tl = gsap.timeline({ delay: 0.35 });

  if (panel) {
    tl.from(panel, { opacity: 0, y: 28, duration: 0.8, ease: 'power3.out' });
  }

  if (nodes.length) {
    tl.from(nodes, {
      opacity: 0,
      y: 10,
      scale: 0.9,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }

  if (conn) {
    const len = conn.getTotalLength();
    gsap.set(conn, { strokeDasharray: len, strokeDashoffset: rtl ? -len : len });
    tl.to(conn, { strokeDashoffset: 0, duration: 0.7, ease: 'power3.inOut' }, '-=0.1');
  }

  tl.add(() => motif.classList.remove('is-dim'), '-=0.25');

  if (tiles.length) {
    tl.from(
      tiles,
      { opacity: 0, y: 14, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
      '-=0.4'
    );
  }

  // Slow restock loop on the flagged tile (amber -> green and back).
  const restock = motif.querySelector<HTMLElement>('[data-restock]');
  if (restock) {
    const qtyEl = restock.querySelector<HTMLElement>('[data-qty]');
    const labelEl = restock.querySelector<HTMLElement>('[data-status-label]');
    const lowLabel = labelEl?.textContent ?? '';
    const inLabel =
      motif.querySelector<HTMLElement>('[data-tile][data-status="in"] [data-status-label]')
        ?.textContent ?? lowLabel;

    const proxy = { v: 38 };
    const setQty = () => {
      if (qtyEl) qtyEl.textContent = String(Math.round(proxy.v));
    };

    const loop = gsap.timeline({ repeat: -1, delay: 2.2 });
    loop
      .to(proxy, { v: 126, duration: 1.4, ease: 'power1.inOut', onUpdate: setQty })
      .call(() => {
        restock.setAttribute('data-status', 'in');
        if (labelEl) labelEl.textContent = inLabel;
      })
      .to({}, { duration: 2.6 })
      .call(() => {
        proxy.v = 38;
        setQty();
        restock.setAttribute('data-status', 'low');
        if (labelEl) labelEl.textContent = lowLabel;
      })
      .to({}, { duration: 1.6 });
  }
}

/* §3 — locked back-office data releases into live, connected, shared. */
function initMechanism(): void {
  const mech = document.querySelector<HTMLElement>('[data-mechanism]');
  if (!mech) return;
  mech.classList.add('is-locked');
  ScrollTrigger.create({
    trigger: mech,
    start: 'top 78%',
    once: true,
    onEnter: () => gsap.delayedCall(0.25, () => mech.classList.remove('is-locked')),
  });
}

/* §5 — pinned step-through (desktop + motion only). */
function initStepThrough(): void {
  const how = document.querySelector<HTMLElement>('[data-how]');
  if (!how || window.innerWidth < 820) return;

  const steps = Array.from(how.querySelectorAll<HTMLElement>('[data-step]'));
  const nodes = Array.from(how.querySelectorAll<HTMLElement>('[data-flow-node]'));
  const fill = how.querySelector<HTMLElement>('[data-flow-fill]');
  const stepsWrap = how.querySelector<HTMLElement>('.how__steps');
  if (steps.length === 0) return;

  // Reserve room for the tallest step BEFORE we stack them, so the cross-fade
  // never clips and the pinned canvas keeps a stable height.
  const maxH = steps.reduce((h, s) => Math.max(h, s.offsetHeight), 0);
  if (stepsWrap && maxH) stepsWrap.style.minHeight = `${maxH}px`;

  how.classList.add('is-enhanced');

  const setActive = (idx: number) => {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    nodes.forEach((n, i) => {
      n.classList.toggle('is-active', i === idx);
      n.classList.toggle('is-done', i < idx);
    });
  };
  setActive(0);
  if (fill) fill.style.transform = 'scaleY(0.04)';

  ScrollTrigger.create({
    trigger: how,
    start: 'top top+=96',
    end: `+=${steps.length * 60}%`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
      setActive(idx);
      if (fill) fill.style.transform = `scaleY(${Math.max(0.04, self.progress)})`;
    },
  });
}
