# ARA Landing Page v2 — CHANGES

## v3 — Final judge pass

A fresh session judged the rendered page as three people — a skeptical
hospital procurement director, a pharma commercial director, and a design
director — plus dedicated mobile and truth audits, with every finding
adversarially verified before any edit. All verdicts were positive; the
edits below are the surgical remainder. (The account design skills would
not load in this session — "Unknown skill" — so their stated methodologies
were applied manually, as the handoff instructed.)

**Shelved ideas, decided.** (a) Frameless screenshot: ACCEPTED, narrowed —
the "Who it's for" org mock lost its browser chrome and fake URL bar (it is
a mock, not an app screenshot; the chrome implied otherwise) and became a
standalone panel; the floating alert-chip half of the idea was rejected.
The two real screenshots keep their frames — repetition of two is rhythm,
not monotony. (b) Mono seam annotations: REJECTED — mono eyebrows already
sit at every seam; a second mono layer would spend an already-spent voice.

**Trust & truth** — footer Privacy/Terms are no longer dead `href="#"`
links; they read "coming soon" as muted non-links (same honesty pattern as
the AR toggle). The two real app screenshots — the only data-bearing
visuals without an honesty label — now carry one ("Demo data — all
organizations shown are fictional" under the hero; "Shown with illustrative
data." in the platform caption). The org mock no longer lists two canon
customer organizations as one org's "branches" (now Main Hospital /
Al Rawdah Branch — no more implied cross-org visibility). "Rawasi Pharmacy
Chain" → canon "Rawasi Pharmacy"; alert-feed "Branch 1 — Malaz" renumbered
to Branch 3 (the hero screenshot's Branch 1 is Tahlia). "The integration is
this small" → "The payload is this small" (what's shown is a payload).

**Copy** — FAQ cost answer: "pay nothing to join" → "pay nothing" (the
hedge read as free-to-join-paid-to-use), and the pharma side now gets
"we'll walk you through how the partnership works." The platform lead
gains one mirror sentence for the paying side ("Companies see the same
picture in reverse…"). "Built for every side of the shelf" → "both sides"
(the exact phrase performed twice in H2s two sections apart).

**Design** — zero-count pills in the org mock ("Low 0", "Out 0") no longer
spend semantic amber/red; a neutral `.pill-zero` keeps alert colors for the
one real alert ("Out 1").

**Mobile/tablet** — the hero's orbit rings now hide up to 1024px (packets
drifted over the stacked copy and CTA at 768); the Push API snippet wraps
instead of clipping mid-word at 375 (the "mapped to Atorvastatin 20 mg"
payoff line was being cut); the alert-feed footer flows as one sentence at
375; facts-strip cells get their line length back at 375.

**Consistency** — footer demo mailto now carries the same pre-filled body
as the other three demo CTAs; FAQ added to the footer Product column;
duplicate "5" section comment renumbered.

**Code review on the diff (8 angles, adversarially verified)** — caught and
fixed before commit: the new footer "coming soon" text was 4.43:1 contrast
(just under AA) and was brightened to 6:1; all five demo mailto bodies now
encode line breaks as %0D%0A per RFC 6068 (bare %0A can render the template
as one run-on line in classic Outlook — a pre-existing issue the footer edit
would have propagated); the org panel now shares .browser.on-light's
elevation rule instead of duplicating the shadow; a dead .shot-cap rule pair
and a redundant single-use .org-panel class were removed.

**Deliberately left** — "encrypted in transit" in the security FAQ: a
truth audit flagged it as outside the handoff's vetted-claims list, but it
is in the founder-approved spec (REVISION_PLAN §2.11) and describes
standard HTTPS; founder should confirm the app serves only over TLS, else
say the word and it comes out. Also left: hosting-location/PDPL language
(nothing verifiable to say yet), pixel-retouching "Rawasi Pharmacy Chain"
inside company-dashboard.png (out of scope for this pass), and the founder
still owes a real org-admin screenshot to replace the inline mock.

**Verified** — 375/768/1440 render with zero horizontal overflow; FAQ
keyboard nav (Tab/Enter, visible focus); reduced-motion neutralizes
everything (SMIL paused, packets hidden, reveals/bars/ECG in final state,
feed and clock static); no console errors (the only failures in the
sandbox are its own Google Fonts block); footer legal placeholders are no
longer in the tab order.

## v2.2 — Design audit + typography system

Three parallel audits (visual/layout, typography, microcopy) ran against the
rendered page; every adopted finding is below.

**Typography** — Inter now loads as a single variable font with the optical-
size axis: body text keeps the text masters, headlines get the true Display
cut (tracking relaxed to match), and the payload shrinks versus the four
static weights. Fonts moved from `@import` inside the token sheet to
preconnect + `<link>` in the head (faster first paint). IBM Plex Mono 600
now actually loads — the ticking clock and step numbers were faux-bold.
Scale repairs: the statement head is now a real step above section heads;
a stray 24px heading tier removed; FAQ measure to 65ch; mono letter-spacing
unified to three stops. Three Arabic bugs fixed: أرى was silently falling
back to a system font (missing `lang`/family), the nav "قريباً" was below
Arabic legibility size, and the footer's Arabic fell out of the mono stack.

**Visual audit fixes (14)** — alert feed fills its focal card and fits
phones properly (location column dropped ≤480px, header stacks); orphaned
caption fixed; decorative hero dots no longer collide with mobile copy;
step cards became open columns (restoring dense/airy rhythm); SKU-mapping
rows align on a grid; the redundant ROADMAP pill removed; the FAQ's dead
right rail is now a sticky "Still deciding?" contact aside; border radii
collapsed to an 8/12/16 scale and icon tiles to two sizes; footer brand
gets its own row on phones; the nav CTA's one-off glow removed.

**Microcopy (12 edits)** — terminology unified (pharma suppliers are
"companies" everywhere); "Arabic-ready" corrected to "Arabic coming soon";
the ERP FAQ now says "stays in sync with it" (accurate: data is pushed);
clichés and filler trimmed.

## v2.1 — Stripe-calibre refinement pass

Built from a five-lens deconstruction of stripe.com (layout geometry, type &
color, motion grammar, enterprise trust moves, restraint rules), mapped onto
ARA's locked brand, then adversarially reviewed (22 confirmed findings fixed).

**Restraint (the biggest single upgrade)** — attention treated as a budget:
the hero now runs one quiet motion system (three slow packets) instead of
four competing loops, and its decorative dots no longer spend the semantic
alert colors; gradient text appears only at the hero/final-CTA bookends;
buttons shift color instead of jumping with growing glows; section heads no
longer animate in (only the visual grids do, less and faster); spacing,
gaps, and type sizes sit on closed scales; display type drops to 700 with
tighter tracking (mass from size, not boldness).

**Structure** — the two navy bands (#intelligence, #trust) enter on Stripe's
signature diagonal seam (clip-path, constant angle at every width) with two
accent stripes riding the intelligence fold; Integration is now a bento whose
focal card proves "not a systems overhaul" with an honest API request sample
(labeled fully illustrative); Trust closes with a facts strip that counts
architecture truths (0 / 1 / 2 / Now) — deliberately not traction numbers;
platform value rows carry mechanism receipts; the hero carries a quiet
three-line qualifier (free for healthcare orgs · works alongside your ERP ·
built in Riyadh).

**Micro-interactions** — Stripe's sliding-arrow hover on the demo CTAs
(chevron at rest, stem draws in); nav-link underlines; FAQ answers fade in
via CSS only (native `<details>` semantics untouched — an earlier JS
animation was removed after review for race/compat/AT reasons); the final
CTA drifts two slow aurora blobs (46/58s, compositor-only), the one ambient
moment on the page.

**Review fixes worth knowing about** — the mobile-collapse rules were being
defeated by cascade order (grids genuinely didn't stack between 761–880px);
alert-feed table now scrolls inside its card on phones; two new text styles
were below AA contrast and got darkened; "three ways in" vs the facts
strip's "2 ways in" contradiction resolved ("two ways in, one shared
catalog"); the API sample's "This is the whole integration" softened to
"The integration is this small" with a stronger illustrative hedge; a
mechanism line that over-specified the security claim was aligned with the
vetted "enforced at the database level" wording.


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
