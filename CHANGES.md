# ARA Landing Page v2 — CHANGES

What changed from the approved draft to v2, section by section, and why.
Companion to `REVISION_PLAN.md` (the approved checkpoint). Branch:
`claude/gallant-ride-eafxir`; the v1 Astro site stays archived on
`archive/v1-astro-build`.

## Repo / structure

- **Astro build retired** from this branch; v2 is a static bundle:
  `index.html` + `colors_and_type.css` (brand tokens) + `assets/landing.css`
  (layout) — the locked two-stylesheet architecture, no build step.
- All heavy inline `style=""` blocks consolidated into `assets/landing.css`
  as named classes. Bar-chart heights stay inline (per-element data values).
- This consolidation also fixed a latent bug: the platform and audience
  grids had no mobile stacking rule and stayed two-column on phones.

## Truth fixes (brief rule 1)

- **Screenshots retouched at pixel level** (matching font, sampled colors,
  rebuilt gradients): "Pfizer" → **Amal Pharma** everywhere; Lipitor /
  Norvasc / Zithromax / Celebrex / Sulperazon → generic INN names;
  Dallah Namar / Habib Sahafa / Salam → **Al Wadi General Hospital /
  Qimam Medical Group / Rawasi Pharmacy**.
- Step-1 permission toggles: Pfizer/Novartis/GSK → Amal Pharma / Bayan
  Medical / Thurayya Labs (one shown revoked).
- All drug names on the page (alert feed, JS pool, SKU mapping, rep tags)
  are now generic INN names — professional and trademark-free.
- The "hours lost" ticking clock caption and the alert-feed footer are now
  explicitly labeled illustrative; the rep list kicker carries
  "· illustrative".

## Section-by-section

1. **Nav** — labels lose question marks; **Request a demo** is the primary
   button, **Sign in** a secondary text link; the dead AR toggle became an
   honest non-interactive "العربية — قريباً" state (hidden on small screens).
2. **Hero** — headline kept; new outcome-first subhead; primary CTA is the
   demo request (mailto with pre-filled subject/body); screenshot eager +
   `fetchpriority=high`.
3. **Statement** — no longer repeats the hero; now the page thesis:
   *"Availability is a shared problem. Visibility should be too."* The
   tagline moved to the final CTA as the closing promise.
4. **What we solve** — sharp problem framing ("Stockouts are invisible —
   until they reach the patient."); all mock data truth-fixed.
5. **The platform** (was "What ARA does") — broken grammar rewritten;
   value rows tightened (Live / Accessible / Permission-based).
6. **Intelligence (new)** — the differentiator. "Today — live: the network
   sees itself" (visibility across organizations) vs "Next — where ARA is
   going: the network starts to think" in a dashed **Roadmap** card with a
   "Concept preview" expiry-buckets mock, so direction can't be mistaken
   for shipped features.
7. **Who it's for** — copy tightened; healthcare card visual is currently
   an inline brand-style org-dashboard mock (labeled *Illustrative*) inside
   the browser frame — **swap for the real org-admin screenshot when it
   arrives** (one-line change).
8. **How it works** — copy polished; revocation made visible in step 1.
9. **Works with what you have (new)** — answers the #1 objection: push API,
   CSV upload, catalog standardization. No ERP vendor names.
10. **Built on trust** — pillars per brief: data ownership + instant
    revocation · database-level enforcement · **built for Saudi healthcare**
    (replaces "Always current", which the platform section already says).
    No certification claims.
11. **FAQ (new)** — seven questions in a native `<details>` accordion
    (keyboard-accessible by default): cost (free for healthcare orgs),
    data ingestion, visibility/revocation, ERP replacement, onboarding,
    security, who's behind ARA.
12. **Final CTA** — audience-split cells ("Run a healthcare organization?" /
    "Supply one?") with tailored mailto CTAs; Sign in demoted to a
    secondary line.
13. **Footer** — four columns incl. Legal placeholders (`href="#"`,
    `<!-- TODO: legal pages -->`); "© 2026 ARA Solutions · Riyadh, Saudi
    Arabia"; Arabic brand note.

## Enterprise scaffolding

- Meta description, Open Graph + Twitter cards, canonical
  (`https://arasolutions.io/`), theme-color.
- Generated `assets/favicon-48.png`, `assets/apple-touch-icon.png`, and a
  branded 1200×630 `assets/og-image.png` from the logo mark.
- `<main>` landmark, skip-to-content link, visible focus states on all
  interactive elements, footer text contrast raised to WCAG-AA levels.
- Below-fold screenshot `loading="lazy"`; explicit `width`/`height`
  attributes prevent layout shift.

## Motion / accessibility

- **Reduced-motion gap closed**: the hero SVG's SMIL animations
  (`<animate>`/`<animateMotion>`) ignore the CSS media query, so JS now
  calls `pauseAnimations()` when `prefers-reduced-motion` matches (and
  reacts to changes). JS-driven feed/clock/tilt were already guarded.
- FAQ chevron rotation disabled under reduced motion.

## Verification performed (Chromium/Playwright, local server)

- **375 / 768 / 1440**: rendered and inspected; fixed two found bugs
  (three-step grid overflowed the document at 768; hero headline clipped
  at 375).
- **Anchors**: every in-page anchor resolves; the only `href="#"` are the
  two intentional legal placeholders. External links: `app.arasolutions.io`
  (Sign in ×3) and `mailto:admin@arasolutions.io` (×7 incl. pre-filled
  demo templates).
- **FAQ keyboard**: Tab reaches each question, Enter toggles, focus ring
  visible, Tab enters open panels.
- **Reduced motion**: hero SMIL paused, ticking clock static, alert feed
  static, reveal/bars/ECG rendered in final state.
- **Console**: no JS errors.

### Could not verify in this environment

- Google Fonts loading (the sandbox blocks `fonts.googleapis.com`; local
  font substitutes were injected for screenshots — the `@import` wiring is
  unchanged from the approved draft and should be spot-checked once live).
- The live `app.arasolutions.io` sign-in target and real mail-client
  rendering of the mailto templates (Outlook/Gmail encode `%0A` line
  breaks slightly differently; worth one manual send).
- True OS-level `prefers-reduced-motion` (verified via browser emulation).

## Recommended follow-ups (out of scope)

1. **Real demo pipeline** — replace mailto with a form backed by a static
   form service or a tiny endpoint; add a thank-you state.
2. **Org-admin screenshot** — send the real capture (fictional data) and
   swap out the inline mock in "Who it's for".
3. **Arabic version** — full RTL page behind the "قريباً" state; tokens
   already carry IBM Plex Sans Arabic.
4. **Legal pages** — Privacy Policy + Terms (placeholders are wired).
5. **Analytics** — deliberately absent per brief; consider a
   privacy-light option (e.g. server logs or a cookieless counter) at
   launch.
6. **Performance** — screenshots are ~0.4 MB PNGs; consider WebP/AVIF +
   `srcset` before heavy traffic.
7. **Netlify wiring** — publish directory is repo root; no build command.
