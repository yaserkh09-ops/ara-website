# ARA — Marketing Website

The bilingual marketing landing page for **ARA (أرى)**, a B2B pharmaceutical
**inventory-intelligence** platform for Saudi Arabia.

- **English** (default) at `/` · **Arabic** with full **RTL** at `/ar/`
- One long, immersive-but-enterprise-credible scrolling page
- Static site — no backend, no database, no analytics, no third-party scripts

> This repository is **standalone**. It does not connect to, import from, or
> reference the product app, Supabase, auth, or any backend. The only links out
> are **Sign in** → `https://app.arasolutions.io` and **Get in touch** →
> `mailto:admin@arasolutions.io`.

---

## Tech stack

| | |
|---|---|
| Framework | [Astro](https://astro.build) (static output, near-zero JS) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + brand tokens in `src/styles/global.css` |
| Motion | [GSAP](https://gsap.com) + ScrollTrigger + [Lenis](https://lenis.darkroom.engineering) smooth scroll |
| i18n | Astro built-in routing (`en` default, `ar`), full RTL mirroring |
| Fonts | Self-hosted via `@fontsource` (Inter, IBM Plex Sans Arabic, IBM Plex Mono) |
| Hosting | Netlify (git-connected auto-deploy) |

All copy is sourced verbatim from the locked copy file and lives in
`src/i18n/copy.ts` (bilingual; the Arabic object is type-checked against the
English one). No English-only strings are hard-coded in components.

---

## Local development

Requires **Node 20+** (CI uses Node 22).

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:4321
npm run build      # production build -> ./dist
npm run preview    # preview the production build locally
npm run check      # Astro type / template check
```

Pages:

- English → `http://localhost:4321/`
- Arabic → `http://localhost:4321/ar/`

---

## Project structure

```
src/
  components/
    sections/        Hero, WhatWeSolve, WhatAraDoes, WhoItsFor,
                     HowItWorks, BuiltOnTrust, FinalCta
    SiteNav, SiteFooter, Section, Eyebrow, Button, Wordmark,
    LangToggle, GlassCard, AudienceCard, TrustPillar,
    HeroMotif, MechanismDiagram, Landing
  i18n/
    copy.ts          all bilingual copy (EN + AR), single source of truth
    utils.ts         locale + path helpers
  layouts/
    Layout.astro     <head>, fonts, nav + footer, motion entry
  scripts/
    nav.ts           sticky nav, scroll progress, mobile menu, lang toggle
    motion.ts        Lenis + reveals + hero motif + step-through (reduced-motion safe)
  styles/
    global.css       brand tokens (Tailwind @theme) + base + utilities
public/
  favicon.svg, og-image.svg
netlify.toml         build + headers config
```

---

## Deploying to Netlify (one-time setup)

This site is built to deploy via Netlify's **git-connected auto-deploy** — no
tokens or secrets required.

1. Sign in to [Netlify](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → **GitHub**.
2. Authorize Netlify and pick the **`ara-website`** repository.
3. Netlify reads `netlify.toml`, so the build settings are pre-filled:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `22` (from `netlify.toml`)
4. Choose the **production branch** (e.g. `main`) and click **Deploy**.
5. Netlify gives you a live URL like `https://<name>.netlify.app`.
6. Later, point `arasolutions.io` + `www` at the Netlify site in
   **Domain settings** (DNS is handled separately — not in this repo).

After this, every push to the production branch redeploys automatically. Pull
requests / branch deploys produce shareable preview URLs for review.

---

## Accessibility & quality

- Renders fully in **EN and AR**; responsive at 375 / 768 / 1280
- Visible keyboard focus on every interactive element
- `prefers-reduced-motion` fully respected — animations degrade to instant/none,
  the hero motif renders in its final lit state, no smooth scroll, no pinning
- No layout shift; motion and content are JS-failure-safe (content shows even if
  scripts don't run)

© 2026 ARA. Pharmaceutical inventory intelligence for Saudi Arabia.
