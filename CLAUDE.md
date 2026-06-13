# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

The repo has two main areas:
- `udaan-app/` — the production Next.js 14 (App Router) application. All development happens here.
- `docs/` — product docs (PRD, pitch deck, build guide). Not code.
- `udaan-prototype.html` — a self-contained single-file prototype, separate from the app.

All commands below must be run from inside `udaan-app/`.

## Commands

```bash
# Install dependencies (Node 20+ required)
npm install

# Run dev server → http://localhost:3000
npm run dev

# Type-check and build
npm run build

# Lint
npm run lint

# Database: push schema changes directly to Supabase (no migration files generated)
npm run db:push

# Database: generate SQL migration files from schema changes
npm run db:generate

# Database: open Drizzle Studio (visual DB browser)
npm run db:studio
```

There is no test suite. The demo mode (`DEMO_KIT` and `DEMO_SCRIPT` in `lib/demo.ts`) is the offline test fixture — run the app and click "Watch Sunita's demo" to verify the UI without an API key.

## Environment variables

Copy `.env.example` to `.env.local`. Three services are involved:

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes (for live coach) | Server-side only — never exposed to the browser |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-4-20250514` |
| `DATABASE_URL` | Yes (for analytics/persistence) | Supabase session-mode pooler URL |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | No | Rate limiting; app falls back to no-op if absent |

`DATABASE_URL` is not needed at `next build` time — the DB client is a lazy singleton that only initialises on first request.

## Architecture

### Request flow

```
Browser (page.tsx)
  ├─ POST /api/coach      → Anthropic Claude (streaming off; single JSON response)
  │                       ← structured JSON: {type:"question"} or {type:"kit"}
  └─ POST /api/session    → Supabase (funnel events)
     GET  /api/session    → Supabase (aggregated funnel counts)
```

### The Kit — central data type

`lib/types.ts` defines `Kit`, the structured JSON object Claude returns when the interview is complete. It carries bilingual (`_en`/`_hi`) fields for every user-facing string. The UI renders it directly with no transformation.

### System prompt IS the product (`lib/prompt.ts`)

The coaching stance is enforced in the system prompt, not in UI copy:
- Never question whether she should work; never suggest asking permission.
- Always count her labour as a cost when pricing.
- Ask at most 3 questions, one at a time, then produce the Kit.
- Output ONLY valid JSON — no markdown, no backticks.

The prompt also injects the full contents of `data/schemes.json` so Claude can only ever cite verified government schemes. To add or update a scheme, edit `data/schemes.json` (not `lib/prompt.ts`).

### Bilingual UI pattern

All user-visible strings live in the `L` object at the top of `app/page.tsx`, keyed by `"en"` and `"hi"`. The `bi(en, hi)` helper picks the right variant based on the current `lang` state. The Kit type mirrors this with `_en`/`_hi` field pairs.

### Database (Drizzle + Supabase Postgres)

Three tables in `lib/db/schema.ts`:
- `sessions` — one row per coaching session (UUID PK, no PII)
- `events` — funnel events linked to a session (`session_start | interview_answer | kit_generated | whatsapp_copied`)
- `kits` — the full Kit JSON for each completed session

The DB client (`lib/db/index.ts`) is a lazy proxy singleton — safe to import at module scope, but `DATABASE_URL` must exist before the first actual query.

### Rate limiting

`/api/coach` applies a sliding-window limiter (10 req / 60 s per IP) when both Upstash env vars are set. If they are absent the limiter is skipped entirely — the app still works without Redis.

### Demo mode

`lib/demo.ts` exports `DEMO_SCRIPT` (a scripted conversation) and `DEMO_KIT` (a hardcoded Kit). The UI replays them with timeouts when the user clicks the demo button. No API call is made. This is also the fallback for live demos if the API is unavailable.

---

## Hackathon context (Reuben College "AI for Good", deadline 15:30 Saturday)

**Project**: Udaan (उड़ान) — an AI business coach that turns an Indian woman's existing skill (cooking, tailoring, tuition, mehendi, etc.) into her first independent income. Bilingual Hindi/English, voice-first, mobile-first, judgment-free by design. Distributed through SHGs/NGOs/ASHA workers.

**Rubric to win against**:
- Impact 25%
- Innovation 25% — must be "beyond a chatbot wrapper"
- Technical Quality 20%
- Feasibility 15%
- Presentation 15%

### Architecture layers being built

1. **Interface** — Next.js, voice-first (Web Speech API `hi-IN`), bilingual, mobile-first
2. **RAG scheme-matching engine** — the core innovation. A curated dataset of real Indian women-entrepreneurship schemes (Udyam, Mudra, NRLM/SHG, PM Vishwakarma, state schemes) with structured eligibility fields. Extracts a structured profile from conversation, then retrieves and ranks only schemes she's actually eligible for by her attributes (state, social category, business type, capital). The model reasons over retrieved matches — it never invents schemes. This is what makes us "not a wrapper."
3. **Deterministic pricing/projection engine** — written in code, NOT the LLM, for transparent auditable numbers.
4. **Model router** — Anthropic Claude primary, Gemini Flash fallback (resilience + cost-awareness).
5. **Persistence** — per-user skill profiles, chats, dashboards.
6. **Analytics** — funnel events toward north-star metric (first-sale rate).

### Guardrails (enforced in prompt and code)

- Never invent scheme eligibility
- Pricing always counts her own labour as a cost
- Coach never questions whether she should work or suggests asking permission
- No real marketplace API integrations — generate assets and deep-link, say so honestly
