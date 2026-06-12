# Udaan — उड़ान

**Your skill. Your business. Your flight.**

An AI business coach that turns an Indian woman's existing skill into her first independent income — pricing that counts her labour, a ready WhatsApp storefront message, matched government schemes, and a 12-month income projection. In Hindi and English, voice or text, judgment-free by design.

Built with Next.js 14 (App Router) + the Anthropic API. The Claude API key lives **server-side only** (`app/api/coach/route.ts`).

---

## Quick start (local)

```bash
# 1. Install dependencies (Node.js 20+ required)
npm install

# 2. Configure your API key
cp .env.example .env.local
#    → edit .env.local and paste your key from https://console.anthropic.com

# 3. Run
npm run dev
#    → open http://localhost:3000
```

The **"Watch Sunita's demo"** button works with no API key at all — it's the offline scripted run (also your stage backup and test fixture).

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com → New Project. Vercel auto-detects Next.js.
3. In Project Settings → Environment Variables, add `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`). **Every variable referenced in code must exist in production** — a missing one builds fine, then crashes when a user hits the feature.
4. Deploy. Every branch push gets its own preview URL; `main` is production.

## Project structure

```
app/
  page.tsx              # Full UI: landing → coach chat → Udaan Kit
  layout.tsx            # Root layout + metadata
  globals.css           # Design system (indigo/marigold, kite motif)
  api/coach/route.ts    # Server-side Claude call. API key lives HERE only.
  api/session/route.ts  # Funnel event logging (in-memory; DB-ready notes inside)
lib/
  prompt.ts             # The system prompt — the coaching stance IS the product
  demo.ts               # Sunita's scripted demo (offline mode + test fixture)
  types.ts              # Kit type shared by API and UI
data/
  schemes.json          # VERIFIED government schemes injected into context
                        # (anti-hallucination layer — keep last_verified fresh)
```

## Product behaviours worth knowing (the CPO notes)

- **Judgment-free stance is coded, not hoped for** — see the rules at the top of `lib/prompt.ts`: never question whether she should work, never suggest asking permission, always count her labour in pricing.
- **Schemes can't be hallucinated** — the model may only use entries from `data/schemes.json`. Update that file, not the prompt, when schemes change.
- **Funnel analytics built in** — the UI logs `session_start → interview_answer → kit_generated → whatsapp_copied` to `/api/session`. `GET /api/session` shows the tally. Swap the in-memory store for Supabase/Neon when you pilot (instructions inside the file).
- **Rate limiting** — basic per-IP limiter in the coach route protects your API budget. Replace with Upstash Redis for real scale.
- **Voice input** — browser Web Speech API (`hi-IN`/`en-IN`); works in Chrome.

## Roadmap (post-hackathon)

1. Supabase/Neon persistence for sessions + kits → real funnel metrics
2. WhatsApp bot (Meta Cloud API / Twilio) reusing `/api/coach` — the true distribution channel
3. "Explain this plan to my family" output
4. Partner (SHG/NGO) dashboard: cohort progress, first-sale tracking
5. More languages; Sahara module on the same architecture

## A note on data responsibility

The moment real women's data is stored, India's DPDP Act obligations apply. Keep data minimal, store nothing you don't need, and get proper guidance before scaling a pilot.

---

*Built at the AI for Good Hackathon, Oxford, June 2026.*
