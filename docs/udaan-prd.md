# Udaan — Product Requirements Document (Hackathon v1)

**Owner:** Shreya (CPO + Dev) · **Date:** June 2026 · **Status:** Locked for build day

---

## 1. One-liner

Udaan is an AI business coach that turns a woman's existing skill into her first independent income — in her language, on her phone, judgment-free.

## 2. Problem statement

India's female labour force participation has risen sharply (23.3% in 2017-18 → 41.7% in 2023-24), but prosperity hasn't followed: most women remain in vulnerable, low-paid or unpaid roles, and India has fewer than 1 female entrepreneur for every 10 male entrepreneurs. Millions of women hold monetizable skills (cooking, tailoring, tutoring, mehendi, crafts) but lack the one thing every first-time entrepreneur needs: a mentor. Men have always had informal mentors — friends, colleagues, the market itself. Most Indian women were never allowed into those rooms.

**The gap is not skill or will. It is the bridge from "I can cook" to "I run a tiffin business."**

## 3. Target user (persona)

**Sunita, 38, Lucknow.** Makes the best achar and tiffin food in her colony — for free, for 20 years. Husband drives a cab. Education till class 10. Has a smartphone, uses WhatsApp and YouTube. Has never earned her own money. Her "free hours" are 2–4 pm and after 10 pm, when domestic work pauses. She will never download a "business app" — but she will talk to a coach who speaks Hindi and doesn't judge.

## 4. Job-to-be-done

> When I describe a skill I already have, turn it into a launch-ready business kit — what to sell, what to charge, how to announce it, what government support I can get, and what my life could look like in a year.

## 5. Golden path (the demo IS the product)

1. **Landing** — one promise, one button. Language toggle (हिन्दी / English).
2. **Tell the coach** — she speaks or types her skill in her own words ("main acha khana banati hoon").
3. **Coach interview** — AI asks 2–3 short, warm follow-up questions (one at a time): what dishes, how much time, who has praised her food.
4. **The Udaan Kit** — generated live:
   - 2–3 concrete business shapes with realistic earnings ranges
   - Pricing that counts her own labour, with a confidence script for quoting it
   - Ready-to-send WhatsApp catalog + first promotional message (Hindi + English)
   - Matched government schemes (Udyam registration, Mudra loan, state SHG linkage) with paperwork checklist
   - **"Your possible year"** — a 12-month income projection card + first savings step
5. **First action** — "Send this message to these 10 people today."

## 6. Scope (MoSCoW)

| Priority | Items |
|---|---|
| **Must** | Golden path end-to-end · bilingual (Hindi/English) output · clean mobile-first UI · offline demo mode (pre-scripted Sunita run) |
| **Should** | Voice input (Web Speech API, hi-IN) · "Your possible year" projection card · copy-to-WhatsApp buttons |
| **Could** | More languages · NGO/SHG assisted mode · printable flyer text · savings literacy module |
| **Won't (today)** | Login/accounts · payments · real user data storage · multi-session memory · actual WhatsApp API integration |

## 7. Non-goals & guardrails

- Udaan never questions whether she *should* work, never suggests asking permission, never moralizes. Ambition is assumed legitimate. Doubt is answered with concrete next steps.
- No financial guarantees: projections are labeled as illustrative estimates.
- Scheme information links to official sources; Udaan guides, humans (banks, SHG didis, NGO workers) execute.

## 8. Success criteria (for today)

A judge can speak or type one input and receive the full Udaan Kit, live, in under 90 seconds, in Hindi and English, without errors. Backup: screen-recorded demo video + offline demo mode.

## 9. Why not just ChatGPT? (defensibility)

1. **Workflow, not chat** — structured interview → structured kit → first action. She gets artifacts, not answers.
2. **Local data layer** — Indian schemes, SHG ecosystem, realistic local pricing norms baked in.
3. **Designed behaviour** — the judgment-free coaching stance is written into the system prompt as product behaviour, not left to chance.
4. **Distribution** — through SHGs (80M+ women), ASHA/anganwadi workers, NGOs, and bank CSR programs that want Mudra loan uptake. ChatGPT has no path to Sunita; Udaan's go-to-market *is* the moat.

## 10. Impact metrics (post-hackathon)

- Activation: % of coached sessions that end with a kit generated
- **North star: first-sale rate** — % of users reporting a first paid order within 30 days
- Income generated per user per month (self-reported, sampled via SHG partners)
- Scheme conversion: Udyam registrations / Mudra applications initiated

## 11. Key risks & mitigations

| Risk | Mitigation |
|---|---|
| Family permission as the real blocker | Home-based, family-respectable framing; optional "explain this plan to my family" output. We name honestly what an app cannot fix. |
| Digital/confidence gap | Voice-first; assisted mode via SHG didi or NGO worker |
| Trust deficit | Anchor in official government schemes; distribute via trusted intermediaries; peer proof in SHGs |
| Advice-to-action gap | Every kit ends with one concrete same-day action |
| Hallucinated scheme details | Curated scheme data injected into prompt; links to official portals |

## 12. Business model (pitch answer, not built today)

Free for women, always. Revenue: (1) CSR/bank partnerships — banks are mandated and motivated to grow Mudra/priority-sector lending; Udaan is qualified-lead generation. (2) Licensing to SHG federations, state rural livelihood missions, and NGOs as a program tool. (3) Later: optional commerce take-rate on storefront upgrades.

## 13. Team roles (build day)

- **Shreya — CPO + Dev:** spec, system prompt, prototype build, demo driver
- **Teammate 2 — Pitch lead:** narrative, deck delivery, Q&A captain
- **Teammate 3 — Content lead:** Hindi copy, persona realism, scheme data accuracy, demo script
- **Teammate 4 — Research + QA:** evidence slide, adversarial demo testing, backup video

Cadence: 30-min standups. Feature freeze 2 hours before pitch. Three full demo rehearsals.
