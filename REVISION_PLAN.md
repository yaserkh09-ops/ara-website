# ARA Landing Page — REVISION PLAN (v2)

**Status: CHECKPOINT — awaiting founder approval before any implementation.**
Source of truth: `ARA_LANDING_PAGE_BRIEF_20260706.md`. This plan covers the new
section order, the full rewritten copy, the claim audit, the truth fixes from
code review, and the technical work list.

Branch: `claude/gallant-ride-eafxir` (the v2 branch). The retired Astro build
stays archived on `archive/v1-astro-build`, untouched.

---

## 0 · Blockers — files I still need from you

| File | Status | Needed for |
|---|---|---|
| `colors_and_type.css` | **Missing** | The page won't render without it — it defines every color/font token the layout stylesheet consumes. Please attach it. |
| `assets/ara-logo-mark.png` | **Missing** | Nav + footer brand, favicon generation. |
| `assets/screens/rep-dashboard.png` | **Missing — you want fresh captures** | Hero browser frame. |
| `assets/screens/company-dashboard.png` | **Missing — you want fresh captures** | "The platform" section. |
| `assets/screens/admin-dashboard.png` | **Missing — you want fresh captures** | "Who it's for" section. |

**Screenshot spec** (so your fresh captures drop straight in — see chat message
for how to send them):

- PNG, light theme, app content only (no browser tabs/URL bar — the page adds
  its own browser frame).
- At least **1600 px wide**, ideally a 2× capture (~2560–2880 px). Aspect close
  to **16:10** — the hero crops to 16:10 from the top-left, so keep the
  important UI in the upper-left region.
- Same window size and zoom (100%) for all three, so they feel like one product.
- **Truth rule applies inside screenshots too:** use a demo org with clearly
  fictional facility/company names, no real patient data, and preferably
  generic drug names (Atorvastatin 20 mg, not brand names). If the app's demo
  data still shows real names, tell me — we can note it and I'll flag the risk.

---

## 1 · Section order (v2)

Approved arc kept; three new sections inserted (marked ●):

1. **Nav** — links: What we solve · Platform · How it works · FAQ (no question
   marks). Right side: `العربية — قريباً` (visible coming-soon state, not a dead
   control) · Sign in (secondary text link) · **Request a demo** (primary button).
2. **Hero** — headline kept, new subhead, CTA swap (Request a demo primary).
3. **Statement** — rewritten as the page thesis (no longer repeats hero/tagline).
4. **What we solve** — problem section, sharpened copy, truth-fixed visuals.
5. **The platform** (was "What ARA does") — grammar fixed, copy rebuilt.
6. ● **Intelligence** — the differentiator: "Today the network sees / Next it
   thinks" with an explicit roadmap treatment.
7. **Who it's for** — both audience cards, truth-fixed rep/product tags.
8. **How it works** — 3 steps, fictional companies + generic drug names.
9. ● **Works with what you have** — integration: push API / CSV / catalog layer.
10. **Built on trust** — pillars sharpened per brief §6.
11. ● **FAQ** — 7 questions, accessible `<details>` accordion.
12. **Final CTA** — split by audience, Request a demo primary, Sign in secondary.
13. **Footer** — cleaned labels, legal placeholders, updated © line.

---

## 2 · Full rewritten copy

Conventions: `EYEBROW` · **Headline** · body text. All UI mocks get a small
`Illustrative data` label so no mock number reads as a claim.

### 2.1 Nav
- Links: **What we solve · Platform · How it works · FAQ**
- Language control: `EN` active; second state reads **`العربية — قريباً`**
  (tooltip / aria-label: "Arabic version coming soon"), visibly non-interactive.
- **Sign in** → `https://app.arasolutions.io` (secondary style).
- **Request a demo** (primary) → `mailto:admin@arasolutions.io` with
  subject `Demo request — [Your organization]` and body template:
  > Hello ARA team,
  > Organization:
  > We are a: healthcare organization / pharmaceutical company
  > City:
  > What we'd like to see:

### 2.2 Hero
- Eyebrow: `PHARMACEUTICAL INVENTORY INTELLIGENCE`
- H1 (kept): **Never caught short. Never sold blind.**
- New subhead: *ARA gives hospitals, pharmacies, and the companies that supply
  them one live view of pharmaceutical stock — so gaps are seen and solved
  before they reach the patient.*
- Buttons: **Request a demo** (primary) · **See how it works** (ghost, → #how).

### 2.3 Statement (the page thesis)
- Head: **Availability is a shared problem. Visibility should be too.**
- Body: *Hospitals see their shelves. Suppliers see their warehouses. Nobody
  sees the gap in between — and that's where stockouts live. ARA connects both
  sides to the same live picture of stock, permission by permission.*

### 2.4 What we solve
- Eyebrow: `THE PROBLEM`
- H2: **Stockouts are invisible — until they reach the patient.**
- Lead: *Between the shelf and the warehouse sits a blind spot. Stock runs low
  quietly, reorders travel by phone call and spreadsheet, and everyone finds
  out at the worst possible moment.* Emphasis line: `MANUAL TODAY. COSTLY EVERY DAY.`
- **Alert feed card** (kept): title *Live alert feed · the gap, made visible*.
  Rows switch to generic drug names (Atorvastatin 20 mg, Amlodipine 5 mg,
  Celecoxib 200 mg, Azithromycin 250 mg; JS pool likewise: Amoxicillin/
  Clavulanate, Salbutamol inhaler, Metformin 500 mg, Bisoprolol 5 mg,
  Esomeprazole 40 mg, Clopidogrel 75 mg, Rosuvastatin 10 mg, Sitagliptin
  100 mg). Footer: *Illustrative data — this is what the blind spot looks like
  once you can see it.*
- **Pain 1**: **Counted by hand, chased by phone.** *Manual checks and reorder
  calls consume hours every week — time that should go to patients.*
  Ticking clock kept; caption reworded (truth fix): *Illustrative — the meter
  runs while stock is counted by hand.*
- **Pain 2**: **Restock moments slip past unseen.** *Stock falls below the
  reorder point quietly — and stays there until someone happens to look.*
- **Wide card**: kicker `THE COST LANDS HERE` · **Stockouts reach the patient.**
  *When a gap goes unseen, everyone pays: the organization scrambles, the
  supplier loses the sale, and the patient leaves without their medicine.*

### 2.5 The platform
- Eyebrow: `THE PLATFORM`
- H2: **One live picture of stock, for every side of the shelf.**
- Lead (grammar fixed): *ARA turns inventory records into a live, shareable
  view. See your own stock from anywhere, the moment it changes — and grant
  each supply partner permission to see exactly the products they supply you.
  Nothing more.*
- Screenshot caption: kicker `ONE SOURCE OF TRUTH` · *The spreadsheet locked in
  a back-office ERP, turned into a living command center.*
- Value rows:
  - **Live** — *Stock reflects reality the moment it changes.*
  - **Accessible** — *Data that lived in the ERP back office becomes something
    every cleared team can act on.*
  - **Permission-based** — *Every view is consent-driven. You decide exactly
    who sees what — and can change it at any time.*

### 2.6 ● Intelligence (new)
- Eyebrow: `INTELLIGENCE`
- H2: **First the network sees. Then it thinks.**
- Beat 1 — kicker `TODAY — LIVE`: **The network sees itself.**
  *An ordinary pharmacy system sees one building. ARA sees a network: a
  hospital, its branches, and the companies that supply them — all reading the
  same live truth, each seeing only what it's cleared to see. That's the
  difference between a stock list and visibility.*
- Beat 2 — kicker `NEXT — WHERE ARA IS GOING` (distinct roadmap styling:
  dashed border, muted palette, "Roadmap" badge): **The network starts to think.**
  *The same data that shows what's on the shelf can learn what belongs there.
  Expiry watch. Demand signals. Reorder recommendations that know the whole
  network, not one store. This is ARA's next chapter — in development, and
  labeled that way on purpose.*
- Visual: inline expiry-buckets mock in brand style (green >6 months, amber
  3–6 months, orange <90 days, red expired) with a `CONCEPT PREVIEW · ROADMAP`
  tag. No screenshot; no shipped-feature framing.

### 2.7 Who it's for
- Eyebrow: `WHO IT'S FOR` · H2 (kept): **Built for every side of the shelf.**
- Healthcare card — kicker `FOR HEALTHCARE ORGANIZATIONS`:
  **Free to use, and fully in your control.**
  *See your own stock clearly across every branch and store. Choose which
  suppliers can see the products they supply you — and get fewer stockouts,
  less phone-chasing, and a supply chain that responds to what you actually
  need. Your data stays yours.*
- Pharma card — kicker `FOR PHARMACEUTICAL COMPANIES`:
  **Real-time stock at every authorized account.**
  *Know before a shelf runs empty. Send reps where they're genuinely needed,
  and serve customers on data instead of guesswork.*
  Rep list (truth-fixed, labeled `Illustrative`): reps keep Saudi first names
  (fine — they're people in a mock, not customers); accounts become fictional
  (see §3); product tags become generic drug names.

### 2.8 How it works
- Eyebrow: `HOW IT WORKS` · H2 (kept): **Three steps to a clear network.**
- **1 · Share — Connect inventory, on your own terms.** *Healthcare
  organizations connect their inventory securely. The data stays theirs; they
  decide who can see it — and can switch any company off at any time.*
  Toggle visual: fictional companies (§3), one toggled off to show revocation.
- **2 · Standardize — One clean, standardized catalog.** *ARA maps every
  item to one catalog entry — so a product means the same thing every time,
  everywhere.* Map rows: `ATORVA 20 TAB → Atorvastatin 20 mg` ·
  `amlodipine_5 → Amlodipine 5 mg` · `AZITH-250-CAP → Azithromycin 250 mg`.
- **3 · See — A live view, for cleared teams.** *Organizations see their own
  stock in a new light. Companies see only their products, at accounts that
  authorized them. Nobody sees more than they should.*

### 2.9 ● Works with what you have (new)
- Eyebrow: `INTEGRATION` · H2: **Works with what you have.**
- Lead: *No rip-and-replace. ARA sits alongside the ERP you already run —
  three ways in, no migration project.*
- **Push API** — *Your system pushes stock changes to ARA as they happen. A
  lightweight API for live sync — not a systems overhaul.*
- **CSV upload** — *No integration team? Export and upload. A spreadsheet is
  enough to put an organization on the network.*
- **Catalog standardization** — *Whatever your ERP calls a product, ARA maps
  it to one standard catalog entry — so the same medicine means the same thing
  in every system, every report, every view.*

### 2.10 Built on trust
- Eyebrow: `BUILT ON TRUST` · H2 (kept): **Your data, your terms.**
- **You own your data** — *Your inventory is yours. Grant access company by
  company — and revoke it at any time, effective immediately.*
- **Enforced at the database level** — *Permissions aren't just a screen.
  Access control is enforced at the database level, so a user who isn't
  cleared to see a record can't query it at all.*
- **Built for Saudi healthcare** — *Built in Riyadh, for the Saudi market —
  Arabic-ready, and designed around how Saudi healthcare actually buys,
  stocks, and supplies.* (No certification claims.)

### 2.11 ● FAQ (new — accessible `<details>` accordion)
1. **What does ARA cost?** — ARA is free for healthcare organizations —
   hospitals, clinics, and pharmacies pay nothing to join. Pharmaceutical
   companies partner with ARA commercially. Write to us at
   admin@arasolutions.io and we'll walk you through it.
2. **How does our data get into ARA?** — Two ways: your ERP pushes stock
   changes to ARA through a lightweight API, or your team uploads a CSV
   export. Either way, ARA's catalog layer standardizes your product codes
   automatically.
3. **Who can see our inventory? Can we revoke access?** — Nobody, until you
   grant it. You authorize each company individually, and they see only the
   products they supply you. Revoke any company's access at any time — it
   takes effect immediately.
4. **Do we need to replace our ERP?** — No. ARA sits alongside your existing
   system and reads from it. Your ERP stays the system of record; ARA makes
   what's in it visible.
5. **How long does onboarding take?** — CSV-based organizations can be live
   almost immediately; API connections depend on your IT team's availability,
   and we work alongside them. There's no long implementation project.
6. **Is our data secure?** — Access is permission-based and enforced at the
   database level, not just in the interface, and data is encrypted in
   transit. You control who sees what, and you can withdraw access instantly.
7. **Who is behind ARA?** — ARA is a Saudi company based in Riyadh, built
   specifically for the Saudi healthcare market. We're early-stage and build
   in the open — what you see on this page is what's live today, and we label
   what's still ahead.

### 2.12 Final CTA
- H2: **See what's available. Instantly.** (the tagline lands here now, as the
  closing promise — it no longer occupies the statement section)
- Two audience blocks:
  - `RUN A HEALTHCARE ORGANIZATION?` — *A live view of every shelf you manage.
    Free for healthcare organizations.* → **Request a demo** (primary)
  - `SUPPLY ONE?` — *Your products, at every authorized account, in real
    time.* → **Talk to us** (orange, same mailto with company-flavored subject)
- Secondary line: *Already on ARA?* **Sign in** →`https://app.arasolutions.io`

### 2.13 Footer
- Columns: Product (What we solve · Platform · How it works · FAQ) ·
  Get started (Request a demo · Sign in · Back to top) · Legal (Privacy
  Policy · Terms — `href="#"` placeholders with `<!-- TODO: legal pages -->`).
- Tagline + email kept. Bottom line: **© 2026 ARA Solutions · Riyadh, Saudi
  Arabia** (right side keeps `Riyadh · KSA` mono mark or drops it — I'll drop
  the duplicate).

---

## 3 · Fictional-name replacement set (truth fix #1)

Real names currently in the draft → replacements. All invented; veto any you
dislike. Every mock containing them also gets an `Illustrative data` label.

| Where | Now (problem) | Replacement |
|---|---|---|
| Step-1 permission toggles | Pfizer / Novartis / GSK (real manufacturers, implies customers) | **Amal Pharma** (AM) / **Bayan Medical** (BY) / **Thurayya Labs** (TH, toggled off) |
| Pharma-card rep accounts | Habib Sahafa Hospital, Dallah Namar Medical (read as real Saudi operators) | **Al Wadi General Hospital** / **Qimam Medical Group** |
| Pharma-card rep accounts | Salam Pharmacy Chain | **Rawasi Pharmacy Chain** |
| All drug tags, alert rows, SKU mapping | Lipitor, Norvasc, Zithromax, Celebrex, Diflucan, + 8 more brands in JS pool | Generic INN names: Atorvastatin 20 mg, Amlodipine 5 mg, Azithromycin 250 mg, Celecoxib 200 mg, Fluconazole 150 mg, etc. |
| Alert-feed locations | Branch 2 — Al Rawdah, Branch 4 — Olaya, etc. | Kept — district names are generic geography, not customer claims; covered by the `Illustrative data` label. |

Generic drug names double as a positioning win: pharmacists and procurement
directors read INN names as *professional*, and ARA never rides a trademark.

---

## 4 · Claim audit

| # | Claim (as it will appear) | Tier | Action |
|---|---|---|---|
| 1 | Real-time / live inventory visibility | **Live** | Keep, stated plainly |
| 2 | Permission-based company access, instant revocation | **Live** | Keep; now shown in step 1 + trust + FAQ |
| 3 | Access control enforced at the database level | **Live** (architecture truth) | Keep — please confirm this phrasing is accurate for the current build |
| 4 | Standardized product catalog / SKU mapping | **Live** | Keep |
| 5 | ERP push API + CSV ingestion | **Live** | Keep; becomes the Integration section |
| 6 | Role-scoped views (org / company / rep) | **Live** | Keep |
| 7 | Expiry visibility | **Live** | Mentioned once, inside Intelligence "today" beat — confirm it's shipped, else I move it to roadmap |
| 8 | Expiry watch, demand signals, reorder recommendations, network-aware intelligence | **Direction** | New Intelligence section, explicit "Where ARA is going" treatment + Roadmap badge |
| 9 | AI-powered insights / forecasting / automated POs | **Direction** | Only under roadmap framing; never listed as features |
| 10 | Pfizer / Novartis / GSK in permission visual | **Removed** | Replaced with fictional companies (§3) |
| 11 | Realistic Saudi facility names | **Removed** | Replaced with fictional names (§3) |
| 12 | Brand-name drugs (Lipitor, Norvasc…) | **Removed** | Replaced with generic INN names |
| 13 | "128:04:17 hours lost … still counting" | **Reworded** | Visual kept; caption now explicitly illustrative |
| 14 | "13 unresolved" / "Updated 2 min ago" in alert feed | **Kept as mock** | Card labeled `Illustrative data` |
| 15 | Free for healthcare organizations | **Live** (commercial) | Stated in audience card + FAQ — confirm this is the committed model |
| 16 | Encrypted in transit | **Live** | FAQ only, no certification language — confirm |
| 17 | Saudi company, Riyadh-based | **Live** | Trust pillar + FAQ + footer |
| 18 | "ARA is live and ready today" (old final CTA) | **Softened** | Replaced by audience-split CTA; product being live is implied by Sign in, not shouted |
| 19 | Onboarding "no long implementation project" | **Live-ish** | Phrased as process description, no day-count promise — confirm comfort |
| 20 | No customer logos, testimonials, counts, outcome stats anywhere | — | Verified: none exist in v2 |
| 21 | "designed for ~1M records/day" (allowed by brief) | **Not used** | Omitted — adds little for this audience; say the word if you want it in Trust |

---

## 5 · Technical work list

**Truth/code fixes from review**
1. SMIL animations (hero ripples/packets/nodes) don't respect
   `prefers-reduced-motion` → call `svg.pauseAnimations()` when the media
   query matches (and react to changes); CSS already hides ripples/packets —
   JS pause covers the rest. Alert-feed intervals and clock already guarded.
2. Ticking-clock caption reworded (see §2.4).
3. All heavy inline `style=""` grid/layout blocks in the HTML move into
   `assets/landing.css` as proper classes (two-stylesheet rule).

**Enterprise scaffolding (brief §7)**
4. `<meta name="description">`, Open Graph + Twitter cards, canonical
   `https://arasolutions.io`, favicon (derived from `ara-logo-mark.png`),
   `<html lang="en">` retained + semantic landmarks (`<main>`, `<nav>`,
   `aria-label`s), alt text audit, visible `:focus-visible` states, AA
   contrast check on navy backgrounds.
5. `loading="lazy"` + explicit `width`/`height` on below-fold images; hero
   image stays eager.
6. Footer legal placeholders + © line.

**Polish (brief §8)**
7. Consistent eyebrow/head/lead rhythm on every section (new sections follow
   the existing pattern), hover/motion consistency, FAQ accordion styled to
   brand, nav scroll state already exists (kept).
8. AR toggle → `العربية — قريباً` coming-soon state (no dead control).

---

## 6 · Implementation plan (after your approval)

Clean commits on `claude/gallant-ride-eafxir`:
1. `chore: retire Astro build from v2 branch (archived on archive/v1-astro-build)`
2. `feat: land approved static draft as v2 baseline` (index.html + both
   stylesheets + assets, exactly as approved — so every change after is diffable)
3. `content: full copy rewrite + truth fixes (fictional names, generic drugs, illustrative labels)`
4. `feat: add Intelligence, Integration, and FAQ sections`
5. `feat: conversion path — Request a demo primary, Sign in secondary, AR coming-soon state`
6. `fix: reduced-motion SMIL pause, lazy loading, meta/OG/canonical/favicon, a11y`
7. `refactor: consolidate inline styles into landing.css`
8. `docs: add CHANGES.md`

**Verification** (I have Chromium here): 375/768/1440 renders, every anchor +
CTA target, FAQ keyboard navigation, reduced-motion emulation, console errors.
I'll list anything I can't verify (e.g. the live `app.arasolutions.io` login
page itself, real mail-client rendering of the mailto template).

---

## 7 · Questions folded into this checkpoint

1. Attach `colors_and_type.css` and `ara-logo-mark.png` (blockers).
2. Screenshots: see spec in §0 + chat message.
3. Confirm claim rows 3, 7, 15, 16, 19 (marked "confirm").
4. Veto/adjust any fictional names in §3.
5. Row 21: want "designed for ~1M records/day" in the Trust section, or leave
   it out? (My recommendation: leave it out.)
