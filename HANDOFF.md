# Udaan — Session Handoff Document

**Hackathon**: Reuben College "AI for Good"
**Deadline**: 15:30 Saturday
**Branch**: `shreya/scheme-engine` (off `main`, remote: `https://github.com/arjunnitc1/udaan.git`)
**Dev server**: `cd udaan-app && npm run dev` → http://localhost:3000

---

## What this project is

Udaan (उड़ान) is an AI business coach for Indian women starting their first home business. The user tells Udaan her skill (cooking, tailoring, tuition, mehendi, etc.) via voice or text. Udaan asks up to 3 clarifying questions, then generates a **Kit** — a bilingual (Hindi/English) document containing: business ideas with earnings ranges, itemised prices (counting her labour), a ready-to-send WhatsApp promo message, matched government schemes, a financial projection, and one concrete action for today. Distributed through SHGs/NGOs/ASHA workers.

---

## Repo layout

```
udaan/
├── CLAUDE.md                    ← architecture + hackathon context for Claude Code
├── HANDOFF.md                   ← this file
├── docs/                        ← PRD, pitch deck, build guide (not code)
├── udaan-prototype.html         ← standalone single-file prototype (ignore for dev)
└── udaan-app/                   ← Next.js 14 App Router app — ALL dev happens here
    ├── app/
    │   ├── page.tsx             ← entire UI (landing → coach → kit screens)
    │   ├── layout.tsx
    │   ├── globals.css
    │   └── api/
    │       ├── coach/route.ts   ← POST → Claude, returns Kit or next question
    │       └── session/route.ts ← GET/POST → Supabase funnel events
    ├── data/
    │   └── schemes.json         ← curated scheme dataset (edit here, not prompt.ts)
    ├── lib/
    │   ├── prompt.ts            ← buildSystemPrompt() — the coaching stance
    │   ├── types.ts             ← Kit type definition
    │   ├── demo.ts              ← DEMO_SCRIPT + DEMO_KIT offline fixture
    │   ├── validations.ts       ← Zod schemas for API requests
    │   └── db/
    │       ├── index.ts         ← lazy Drizzle singleton
    │       └── schema.ts        ← sessions, events, kits tables
    └── drizzle/
        └── 0000_initial_schema.sql
```

---

## Commands (run from `udaan-app/`)

```bash
npm install          # Node 20+ required
npm run dev          # http://localhost:3000
npm run build        # type-check + build
npm run lint
npm run db:push      # push schema to Supabase (no migration files)
npm run db:generate  # generate SQL migration files
npm run db:studio    # visual DB browser
```

---

## Environment variables

Copy `udaan-app/.env.example` to `udaan-app/.env.local`.

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes (live coach) | Server-side only |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-4-20250514` |
| `DATABASE_URL` | Yes (persistence) | Supabase session-mode pooler URL |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | No | Rate limiting; app works without it |

---

## Current architecture — what actually exists

### Request flow

```
Browser (page.tsx)
  ├─ POST /api/coach  →  Claude (single JSON response, no streaming)
  │                   ←  {type:"question", text_en, text_hi}
  │                   or {type:"kit", ...full Kit fields...}
  └─ POST /api/session → Supabase (funnel events, fire-and-forget)
     GET  /api/session → Supabase (aggregated funnel counts)
```

### The Kit — central data type (`lib/types.ts`)

The Kit is the structured JSON object Claude returns when the interview is complete. Every user-visible field is bilingual (`_en`/`_hi`). The UI renders it directly with no transformation. Fields:

- `businesses[]` — name, earnings range, why it fits her
- `pricing.items[]` — itemised prices (labour counted)
- `pricing.script_en/hi` — first-person confidence script for quoting the price
- `whatsapp_en/hi` — ready-to-send WhatsApp promo message
- `schemes[]` — matched government schemes with first concrete step
- `projection` — monthly/yearly earnings estimate + assumption + savings habit
- `action_en/hi` — one thing to do today

### System prompt (`lib/prompt.ts`)

`buildSystemPrompt()` injects `schemes.json` as flat text and instructs Claude to:
- Ask ≤3 questions, one at a time
- Output ONLY valid JSON (no markdown, no backticks)
- Never question her ambition or suggest asking permission
- Always count her labour as a cost

**Coaching stance is enforced in the prompt, not UI copy.**

### Schemes dataset (`data/schemes.json`)

4 verified schemes currently:
- **Udyam Registration** — free MSME registration (~15 min)
- **PM Mudra Loan** — collateral-free micro-business loan
- **SHG / NRLM linkage** — women's self-help group credit + network
- **PM Vishwakarma** — for artisans/tailors: training, toolkit, credit

Each entry has: `id`, `name`, `what_en/hi`, `fits[]`, `step_en/hi`, `official_url`, `last_verified`.
**To add a scheme: edit `data/schemes.json` only — do not touch `prompt.ts`.**

### Bilingual UI pattern (`app/page.tsx`)

All UI strings live in the `L` object at the top of `page.tsx`, keyed `"en"` / `"hi"`. The `bi(en, hi)` helper picks the right variant from `lang` state. Kit type mirrors this with `_en`/`_hi` pairs. Language toggle is in the header.

### Database (`lib/db/schema.ts`)

Three tables (Drizzle ORM + Supabase Postgres):
- `sessions` — one row per session (UUID PK, `lang`, `is_demo`, no PII)
- `events` — funnel events: `session_start | interview_answer | kit_generated | whatsapp_copied`
- `kits` — full Kit JSON per completed session

DB client is a lazy proxy singleton — safe to import at module scope, `DATABASE_URL` must exist before first query.

### Rate limiting

`/api/coach`: sliding window 10 req / 60 s per IP when Upstash vars are set. Skipped entirely if absent.

### Demo mode (`lib/demo.ts`)

`DEMO_SCRIPT` + `DEMO_KIT` replay a scripted conversation (Sunita from Lucknow) with timeouts. No API call. Activated by the "Watch Sunita's demo" button. Also the fallback for live demos if the API is down.

---

## What is NOT built yet — the differentiator gap

The hackathon rubric requires "beyond a chatbot wrapper" (25% of score). The current app is a well-structured wrapper. What's described in CLAUDE.md as the differentiator does not yet exist in code:

| Claimed differentiator | Current reality |
|---|---|
| RAG scheme-matching engine | Schemes injected as flat text in prompt; Claude picks by instruction |
| Structured eligibility extraction | No profile extraction; Claude reasons over raw conversation text |
| Retrieve & rank by user attributes (state, category, capital) | Claude selects schemes; no structured query |
| Deterministic pricing/projection engine in code | Projection numbers generated by Claude (LLM), not code |
| Model router: Claude primary + Gemini Flash fallback | Claude only, hardcoded |

### The planned differentiator (to build)

The goal is: **extract profile → filter/rank in code → LLM narrates results**.

1. **Structured profile extraction** — after conversation, extract a typed profile:
   `{ state, skill, hoursPerDay, hasAadhaar, socialCategory, capitalAvailable }`

2. **Eligibility filter in TypeScript** — add structured `eligibility` fields to `schemes.json` (state[], category[], minCapital, etc.) and write a function that filters/ranks schemes against the profile. The LLM never touches matching logic.

3. **Deterministic projection engine** — compute `monthlyRevenue = hoursPerDay × daysPerWeek × ratePerHour − labourCost` in code, not via Claude.

4. **Model router** — try Claude first, fall back to Gemini Flash on error or timeout.

---

## Guardrails (enforced in prompt and must be preserved in any new code)

- Never invent scheme eligibility or scheme names
- Pricing always counts her own labour as a cost
- Coach never questions whether she should work or suggests asking permission
- No real marketplace API integrations — generate assets and deep-link, say so honestly in the UI disclaimer

---

## Testing

No test suite. The demo mode is the offline fixture — run the app and click "Watch Sunita's demo" to verify the UI without an API key.

To test live: set `ANTHROPIC_API_KEY` in `.env.local` and click "Talk to your coach." Verify the Kit renders correctly for a cooking or tailoring input.
