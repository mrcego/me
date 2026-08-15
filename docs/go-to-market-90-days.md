# 90-Day Ethical Distribution Plan

> **Goal:** Reach hiring managers, engineering leads, and technical recruiters who need senior Vue/Nuxt, Frontend Architecture, and Fullstack contract talent — without spam, clickbait, or platform abuse.

---

## Principles

- **Value-first**: Every touchpoint delivers a concrete artifact, insight, or proof point.
- **Attribution**: All AI-assisted output is reviewed, typed, tested, and owned.
- **Platform-native**: Respect each community's norms; no cross-posting automation.
- **Consent**: No cold DMs, no scraped lists, no unsolicited newsletters.
- **Traceable**: Every piece links back to a canonical portfolio URL with schema.

---

## Weeks 1–2: Foundation & Asset Prep

### Portfolio Canonicalization (Days 1–3)

- [ ] Verify all schema, hreflang, redirects, `llms.txt`, `ai.txt`, OKF nodes publish without errors
- [ ] Confirm `generate:netlify` produces clean HTML for home, 6 landings, 3 case studies, `es` alternates
- [ ] Run `pnpm test:e2e` against production build; zero regressions

### Content Pack (Days 4–7)

Produce **6 reusable assets** (each ≤ 90 seconds read):

| Asset                                                  | Format                        | Target                | Canonical Link               |
| ------------------------------------------------------ | ----------------------------- | --------------------- | ---------------------------- |
| "How I structure a Vue 3 micro-frontend repo"          | LinkedIn carousel (5 slides)  | Frontend leads        | `/frontend-architect/`       |
| "CI/CD cut 60% at TISSINI — the exact pipeline"        | GitHub Gist + short writeup   | DevOps / Eng managers | `/case-studies/tissini/`     |
| "AI-assisted delivery vs AI Engineer"                  | 1-page PDF + LinkedIn article | Hiring managers       | `/ai-assisted-craft/`        |
| "Typed Express contracts that Vue consumes safely"     | Code snippet + diagram        | Fullstack leads       | `/nodejs-backend-developer/` |
| "Design system migration: PrimeVue + Tailwind"         | Thread + repo link            | Vue engineers         | `/vue-frontend-developer/`   |
| "Remote senior from Cartagena: timezone overlap table" | Image + Notion page           | Recruiters            | `/#contact`                  |

### Tracking Setup (Days 8–10)

- Add consent-safe `trackEvent` calls (already in `useAnalytics.ts`) for:
  - `case_study_view` (slug, locale)
  - `primary_cta_click` (location: hero, landing, case-study, footer)
  - `cv_download` (locale)
  - `contact_submit` (engagement_type)
- Verify Netlify Forms + GA4 events appear in dashboard
- No PII in events; only `engagement_type`, `location`, `slug`, `locale`

---

## Weeks 3–6: LinkedIn (Primary Channel)

### Profile Optimization (Week 3)

- Headline: `Senior Vue/Nuxt Engineer · Frontend Architect · Fullstack · Remote (Cartagena, CO)`
- About: 3-sentence hook → 3 proof bullets (Colegium 100k, TISSINI 60% CI/CD, LingoQuesto founding) → CTA to portfolio
- Featured: Pin 3 case studies + AI-Assisted Craft methodology page
- Skills: Pin Vue.js, Nuxt.js, TypeScript, Node.js, Frontend Architecture, Design Systems, Micro-frontends

### Publishing Cadence (Weeks 4–6)

| Day | Content                                    | Format                | CTA                    |
| --- | ------------------------------------------ | --------------------- | ---------------------- |
| Mon | Micro-frontend architecture decision       | Carousel (5 slides)   | `/frontend-architect/` |
| Wed | "Vibe Coding Cleanup" case: real PR diff   | Image + 150-word post | `/ai-assisted-craft/`  |
| Fri | Week-in-review: 1 metric, 1 lesson, 1 link | Text post             | Portfolio home         |

**Rules:**

- No engagement pods, no "comment for PDF", no auto-DM tools
- Reply to every substantive comment within 24h
- Tag only when directly relevant (e.g., former colleague at Colegium)
- Zero posts about "AI trends" — only delivery craft

### Outreach (Weeks 5–6)

- **Target**: 15 engineering leads / hiring managers at ed-tech, SaaS, e-commerce (LatAm + US)
- **Method**: Connection request with note referencing their public post / company tech blog → **no pitch**
- **Follow-up**: If accepted, share one relevant asset (e.g., "Saw your post on micro-frontends — this repo structure saved us 40% review time at Colegium")
- **Track**: Conversation → portfolio visit → contact form in GA4

---

## Weeks 7–8: GitHub & Stack Overflow (Technical Credibility)

### GitHub (Week 7)

- Pin 3 repos: `vue-microfrontends-starter`, `nuxt-typed-api-contracts`, `ai-assisted-quality-gates`
- Each repo: `README.md` with architecture diagram, decision log, and link to portfolio case study
- Contribute 2–3 PRs to Vue/Nuxt ecosystem (types, docs, perf) — no drive-by fixes

### Stack Overflow (Week 8)

- Answer 5 questions tagged `vue.js`, `nuxt.js`, `typescript`, `micro-frontends`
- Each answer: minimal reproducible example + link to portfolio article for deeper dive
- Goal: 100+ rep from answers (signals expertise to recruiters searching SO)

---

## Weeks 9–10: Vue/Nuxt Community (Peer Channel)

### Discord / Nuxt Nation / Vue Land

- Join 3 Discords: Nuxt, Vue Land, Frontend Architecture
- **Lurk first** (1 week): learn norms, identify active maintainers
- **Contribute**: Answer 2–3 questions/week in `#help` or `#architecture`
- **Share**: When relevant, drop portfolio link with context ("I wrote about this exact pattern at `/frontend-architect/`")

### Content Repurposing

- Convert LinkedIn carousel → Nuxt blog guest post pitch (if accepted)
- Convert TISSINI CI/CD writeup → Vue.js community newsletter submission

---

## Weeks 11–12: Conversion & Iteration

### Mid-Point Review (Day 60)

| Metric                  | Target           | Source                            |
| ----------------------- | ---------------- | --------------------------------- |
| Portfolio sessions      | +40% vs baseline | GA4                               |
| Case study views        | 500+ total       | GA4 `case_study_view`             |
| Primary CTA clicks      | 100+             | GA4 `primary_cta_click`           |
| CV downloads            | 50+              | GA4 `cv_download`                 |
| Contact submissions     | 15+ qualified    | Netlify Forms + `engagement_type` |
| LinkedIn profile views  | +60%             | LinkedIn Analytics                |
| Qualified conversations | 8+               | CRM (manual)                      |

### Adjustments

- **Below target on contact submissions**: Add "office hours" Calendly link to contact form thank-you
- **Below target on case study views**: Boost internal linking from hero, navbar, footer
- **High bounce on landings**: Add GEO answer block + tighter lead paragraph
- **Low GitHub/Stack Overflow signal**: Double down on 2 high-quality answers/week

### Final Push (Days 61–90)

- Publish "90-day retrospective: what moved the needle" (LinkedIn + portfolio blog)
- Refresh 1 landing page with new proof point from conversations
- Send personalized "still available" note to 10 warm conversations from Weeks 5–6
- Update `llms.txt` / `llms-full.txt` / OKF with new availability date

---

## Risk Mitigation

| Risk                               | Mitigation                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------- |
| LinkedIn algorithm change          | Own distribution: email capture via CV download → direct notification list  |
| Platform policy shift (SO, GitHub) | Canonical content always lives on portfolio; platforms are syndication only |
| AI-content saturation              | Every asset has human review stamp, typed code, verifiable metrics          |
| Recruiter spam perception          | Zero cold DMs; only inbound + warm referrals from public content            |

---

## Budget & Tools

| Item                    | Cost             | Purpose                               |
| ----------------------- | ---------------- | ------------------------------------- |
| LinkedIn Premium (3 mo) | $0 (trial) / $90 | InMail credits for warm outreach only |
| Notion (personal)       | $0               | Asset tracking, conversation log      |
| GA4 + Netlify Forms     | $0               | Consent-safe analytics                |
| Calendly (free)         | $0               | Office hours booking                  |
| Design (Figma free)     | $0               | Carousel / PDF assets                 |

**Total: $0–$90** (no paid ads, no automation tools, no list purchases)

---

## Success Definition (Day 90)

- **3+ signed senior contract engagements** (or active final-round conversations)
- **Portfolio as top acquisition channel** (GA4: `organic > referral > direct`)
- **Zero platform violations** (no warnings, no shadowbans)
- **All content attributable** to canonical portfolio URLs with valid schema

---

## Maintenance (Post-90)

- Monthly: 1 LinkedIn carousel, 1 GitHub contribution, 1 community answer
- Quarterly: Refresh 1 case study / landing with new metric or client outcome
- Semi-annually: Re-run full SEO/GEO audit (`pnpm test:e2e`, `pnpm generate:netlify`, schema check)
