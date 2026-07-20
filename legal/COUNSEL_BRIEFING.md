# ARA — Briefing Pack for Saudi Counsel
**Prepared:** 20 July 2026 · **Contact:** admin@arasolutions.io
**Scope:** Review of the website Privacy Policy and Terms of Service (bilingual AR/EN, Arabic prevailing) before publication at arasolutions.io.

> This pack was prepared with AI assistance and internal review. It is not legal advice; it exists to make your review fast and targeted. The documents to review are the live drafts at `/privacy-policy/` and `/terms-of-service/` in the website repository (branch `legal-pages`), each containing the Arabic (prevailing) and English versions on one page.

---

## 1. The company and product, in one page

- **Entity:** ara alraqamiya Establishment (مؤسسة ارى الرقمية), Commercial Registration Certificate — Unified National No. **7054518043**, entity type Establishment, status Active. Address: King Salman Road, Al Malqa District, Riyadh 13523.
- **Product:** ARA (أرى) — a B2B SaaS platform (arasolutions.io marketing site; app.arasolutions.io platform) giving Saudi healthcare organisations and pharmaceutical companies a shared, permission-based, real-time view of pharmaceutical stock. ARA is a visibility layer beside the customer's ERP; it does not buy/sell/dispense products and is not a party to supply contracts.
- **Commercial model (two solutions, one platform):**
  1. **Intelligent Inventory Management** — paid subscription bought by healthcare organisations for their own operations.
  2. **Network Visibility & Management** — paid subscription bought by pharmaceutical companies.
  Joining a company's network is **free for the healthcare organisation** — the company pays; the organisation only grants scoped, revocable authorisation. No commissions, no per-contract percentages.
- **Personal data processed:** staff account data (name, work email, phone, role, organisation), website form submissions, technical/browser data, login/action/audit logs. **No patient data** (prohibited by the Terms and by design). No sensitive personal data. No analytics or advertising cookies at present.
- **Infrastructure:** external cloud providers (Supabase/AWS stack); personal data may be stored **outside KSA** — the drafts name Bahrain (AWS me-south-1). Role-based access enforced at database level (RLS); encryption in transit; hashed credentials; audit logging; test/prod separation.

## 2. Decisions already taken (please validate, don't redesign)

- One bilingual page per document; **Arabic prevails** (Arabic text exists and was reviewed for AR/EN parity — zero meaning-level divergences found; see §5).
- Retention: account data deleted/anonymised within 90 days of closure; audit/security logs up to 24 months; uploads per customer agreement.
- Liability: cap = fees paid in trailing 12 months, floor SAR 10,000 for organisations **without a paid subscription** (deliberately not called a "Free plan").
- Disputes: SCCA arbitration, sole arbitrator, seat Riyadh; interim relief in Saudi courts. Governing law: KSA.
- All contact addresses: admin@arasolutions.io (interim single mailbox).

## 3. THE open factual item — cross-border transfers (Privacy §4)

Privacy §4 currently states data may be stored in Bahrain (AWS me-south-1) and that ARA applies SDAIA-approved standard contractual clauses and transfer risk assessments. **These safeguards are not yet executed.** The company will either (a) execute provider DPAs + SDAIA SCCs + a transfer risk assessment before go-live, or (b) re-platform personal data to a KSA region and simplify §4. Please advise which path you recommend, whether Bahrain benefits from any current adequacy decision, and what the current SCC template/registration formalities are.

## 4. Top questions for you (ranked)

1. **DPO:** Does ARA's processing trigger mandatory DPO designation? If yes, must DPO contact details appear in the Privacy Policy?
2. **Legal basis (Privacy §2):** We rely on "legitimate interest (المصلحة المشروعة) of ARA, contract performance, and legal obligation." Is this correctly framed per amended PDPL Art. 6, is a documented legitimate-interest assessment required, and must a right to object be surfaced?
3. **Art. 13 disclosure:** We added a mandatory/optional-provision statement in §1. Sufficient?
4. **Breach notice:** §8 commits to SDAIA within 72h and affected individuals without undue delay where harm is likely. Correct thresholds/wording per current Implementing Regulations?
5. **Transfers:** see §3 above (adequacy vs SCC route; current template; registration on the National Data Governance Platform — is controller registration mandatory for ARA?).
6. **Liability cap (Terms §8):** enforceability of the cap/exclusions before Saudi courts and SCCA tribunals.
7. **Arbitration by click-wrap (Terms §10):** does browser/click acceptance satisfy the Arbitration Law's written-agreement requirement, and is the clause enforceable against non-paying network participants?
8. **Acceptance & authority (Terms intro):** is acceptance-by-use plus an authority-to-bind representation sufficient for B2B binding, especially for organisations that only grant authorisation?
9. **Anonymised analytics (Terms §4):** does our "aggregated, anonymised data" licence meet the PDPL anonymisation standard so that such data falls outside PDPL scope?
10. **Unilateral amendment (Terms §11):** enforceability of "continued use = acceptance" with 30 days' notice for material changes.
11. **Entity form:** the operator is an Establishment (مؤسسة) — unlimited proprietor liability. Given hospital/pharma customers, should conversion to an LLC precede large contracts, and should the documents anticipate assignment to a successor entity?
12. **Entity name transliteration:** English text uses "ARA Alraqamiya Establishment"; CR certificate prints "ara alraqamiya Establishment"; Arabic uses the registered «مؤسسة ارى الرقمية». Acceptable?

## 5. Reviews already performed (AI-assisted; summaries available on request)

- **PDPL coverage pre-review (English):** article-by-article table against PDPL/Implementing/Transfer Regulations. Fixed pre-review: legal-basis term corrected to المصلحة المشروعة; Art. 13 mandatory/optional disclosure added; data-subject breach notice added. Remaining gaps routed to you as the questions above.
- **Bilingual precision review:** clause-by-clause AR↔EN comparison — zero meaning-level divergences; all factual constants (CR number, address, amounts, periods) verified identical across languages; Arabic grammar/i'rab clean.
- **Positioning gate:** both documents verified free of commission/revenue-share language and consistent with the two-solution commercial model.

## 6. Operational compliance checklist (company to-do; promises the documents make)

1. Execute DPAs with each processor (Supabase, AWS, email delivery, error monitoring).
2. Execute SDAIA SCCs + transfer risk assessment, or re-platform to KSA (see §3).
3. Incident-response process capable of 72-hour SDAIA notification + individual notice.
4. Data-subject-request handling within ~30 days via admin@arasolutions.io.
5. 90-day account-data deletion routine; 24-month log roll-off.
6. Maintain a Record of Processing Activities; determine DPO need; check National Data Governance Platform registration.
7. Keep true: no analytics cookies; no plain-text passwords; no sensitive/patient data; RLS role enforcement; 30-day post-termination export then deletion; genuine anonymisation for any aggregated analytics.
