# HANDOFF — Final Judge Pass (fresh session)

You are the FINAL JUDGE for the ARA marketing landing page. Previous sessions
built it; your job is to evaluate it with fresh, skeptical eyes and make only
the last, surgical edits. You have no attachment to any prior decision — but
you must respect the locked rules below.

## What this is

ARA (أرى — "I see") — B2B pharmaceutical inventory-visibility platform for
Saudi Arabia. Early-stage. The site is a single static page:
`index.html` + `colors_and_type.css` (brand tokens) + `assets/landing.css`
(layout) + vanilla JS inline. No build step. Branch:
`claude/gallant-ride-eafxir` (develop and push here; NEVER touch
`archive/v1-astro-build`). `REVISION_PLAN.md` is the approved spec;
`CHANGES.md` is the change history (v2 → v2.2). Read all three files and both
stylesheets fully before judging.

## Non-negotiable rules (violating these fails the task)

1. **Truth over polish.** No invented customers, logos, testimonials, stats,
   or capabilities. Mock data is labeled Illustrative/Representative — those
   labels must survive. Roadmap features stay visually fenced (dashed card in
   #intelligence). Vetted claims that must keep their meaning: free for
   healthcare organizations · permission-based access with instant revocation ·
   enforced at the database level · push API + CSV in · standardized catalog ·
   built in Riyadh · English launch, Arabic coming soon.
2. **Brand locked:** Navy #0C285D, Sky #28CDFC, Action #0673FF, Orange (CTA),
   semantic green/amber/red; Inter (variable, optical sizing) + IBM Plex Mono +
   IBM Plex Sans Arabic (Arabic glyphs only). Tagline "See what's available.
   Instantly." Headline "Never caught short. Never sold blind."
3. **Tech locked:** static HTML/CSS/vanilla JS, two-stylesheet architecture,
   no frameworks, no analytics, no backend. `prefers-reduced-motion` must
   fully neutralize every animation (there's a consolidated backstop at the
   END of landing.css — late-cascade blocks there must stay last).
4. Never reference or connect to the product repo (ara-solutions), Supabase,
   or any backend.

## Founder decisions already made (do not relitigate)

- Hero background is the plain dot-grid. An أرى watermark + Saudi
  constellation were tried and REVERTED by the founder — do not reintroduce.
- "Request a demo" (mailto) is the primary CTA; "Sign in" secondary.
- The AR toggle is an honest "العربية — قريباً" non-control.
- FAQ uses native <details> with a CSS-only open animation (a JS animation
  was removed for race/AT reasons — do not re-add).
- Fictional demo names are canon: Amal Pharma, Bayan Medical, Thurayya Labs,
  Al Wadi General Hospital, Qimam Medical Group, Rawasi Pharmacy; generic INN
  drug names only.

## Your job

1. **Judge:** read the rendered page top-to-bottom as (a) a skeptical hospital
   procurement director and (b) a pharma commercial director. The quality bar:
   neither may be left asking "what does it cost / how does our data get in /
   can we trust them / how is this different from an ERP." Then judge it as a
   design director: hierarchy, rhythm, restraint, mobile.
2. **Report** your verdict briefly to the founder (he is non-technical):
   what's strong, what you're changing, what you're deliberately leaving.
3. **Make the last edits** — surgical, not a redesign. Candidate items the
   previous session left on the shelf, to accept or reject on your own
   judgment: (a) go frameless on one screenshot (layered panel + floating
   alert-chip fragment instead of a third browser mockup); (b) small mono
   annotations at section seams (engineering-blueprint voice); (c) anything
   your fresh eyes catch that prior audits missed.
4. **Verify** at 375/768/1440 (no horizontal overflow anywhere), FAQ keyboard
   nav, reduced-motion, zero console errors.
5. **Commit clean, push to the branch, update CHANGES.md** with a "v3 — final
   judge pass" section.
6. **Republish the founder's preview**: build a self-contained preview.html
   (inline both stylesheets minus font @imports/link, base64 the images and
   fonts) and publish with the Artifact tool passing
   `url: "https://claude.ai/code/artifact/db777d21-49b9-454a-8c8b-103a979f4ed7"`
   so his existing link updates.

## Environment notes (save yourself an hour)

- The sandbox blocks fonts.googleapis.com IN THE BROWSER (curl works). For
  faithful screenshots: serve the repo root (`python3 -m http.server 8765`
  from repo root — beware: shell cwd resets between commands, so launch with
  an absolute-path command), fetch Inter variable (opsz 14..32) + Plex
  Mono 400/500/600 + Plex Sans Arabic as files via curl with a browser UA,
  and inject a local @font-face sheet (same-origin — cross-port fonts are
  CORS-blocked). Playwright: use executablePath '/opt/pw-browsers/chromium'
  with playwright-core.
- Screenshot full pages with the reveal classes force-added; two capture
  artifacts are NOT bugs: the dark band under the hero (scroll-driven
  "lights-on" statement veil) and an empty white browser frame mid-page
  (lazy-loaded image).
- GitHub access: use the GitHub MCP tools, not gh. Commit as Claude
  <noreply@anthropic.com>.
- The "Who it's for" healthcare card uses an inline org-dashboard mock — the
  founder still owes a real org-admin screenshot; leave the mock unless he
  provides it in your session (then retouch names to the canon set first).
