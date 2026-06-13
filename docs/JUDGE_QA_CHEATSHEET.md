# Udaan - Judge Q&A Cheat Sheet

## Quick Stats
- **Target Users**: 195M+ Indian women with skills but no business knowledge
- **Languages**: 6 (English, Hindi, Bengali, Malayalam, Tamil, Telugu)
- **Tech Stack**: Next.js 14 + Claude Sonnet 4 + Supabase + Drizzle

---

## "Why is this not just a ChatGPT wrapper?"

**Memorize these 5 points:**

1. **RAG for Government Schemes** - We inject verified scheme data from a curated JSON file. The model CAN'T hallucinate schemes - it only recommends from our verified list.

2. **Structured Bilingual Output** - Every response is forced into a typed JSON schema with `_en` and `_hi` variants for every field.

3. **Domain-Specific Guardrails** - Prompt encodes feminist economics: always count her labor as cost, never question if she should work.

4. **Voice-First Architecture** - Web Speech API for both input (STT) and output (TTS) in 6 Indian languages.

5. **Offline Demo Mode** - Complete scripted demo works without any API calls.

---

## Technical Differentiators (for "Innovation" rubric)

| Feature | What It Is | Why It Matters |
|---------|-----------|----------------|
| **RAG Scheme Matching** | Inject verified schemes into prompt | Prevents hallucinating fake govt programs |
| **Bilingual Types** | `Kit.pricing.script_en` + `script_hi` | Every UI element works in both languages |
| **Voice Sales Tracking** | Parse Hindi/English speech to transactions | Low-literacy users can speak "Sold 5 samosas for 100 rupees" |
| **Lazy DB Singleton** | Connect only on first request | `next build` works without DATABASE_URL |
| **Sliding Window Rate Limit** | 10 req/60s via Upstash Redis | Protects API budget, serverless-friendly |

---

## Quick Answers to Expected Questions

### "How do you prevent bad advice?"
- Only verified schemes from curated JSON
- "Conservative earnings, realistic small-town prices" in prompt
- All projections labeled as estimates
- Never questions if she should work

### "Why Claude over GPT-4?"
- Better JSON instruction following
- Constitutional AI handles sensitive topics better
- Better cost-performance ratio

### "How does it scale?"
- Serverless functions auto-scale on Vercel
- Supabase session-mode pooler for DB
- Rate limiting via Upstash Redis
- Future: response streaming, kit caching

### "What about privacy?"
- No PII in database (UUID sessions)
- Phone/name in localStorage only
- API keys server-side only

### "What if API is down?"
- Demo mode works offline
- Finance/goals/piggy bank use localStorage
- Clear bilingual error messages

---

## Architecture One-Liner

```
Browser (Next.js + Web Speech API)
    → /api/coach (Zod validation + Rate limiting)
    → Claude Sonnet 4 (RAG prompt with verified schemes)
    → Supabase Postgres (funnel analytics)
```

---

## Key Files to Reference

| File | What It Does |
|------|--------------|
| `lib/prompt.ts` | 100-line system prompt with RAG schemes |
| `lib/types.ts` | Full bilingual Kit type definition |
| `data/schemes.json` | Verified government schemes |
| `api/coach/route.ts` | Rate limiting + Claude integration |
| `lib/db/schema.ts` | Drizzle schema (sessions/events/kits) |

---

## Impact Numbers (for "Impact" rubric)

- **195M** Indian women have marketable skills
- **Only 14%** of Indian MSMEs are women-owned
- **₹16,500** average monthly income potential for tiffin business
- **~5 days** to first order with proper coaching

---

## Demo Flow (if asked)

1. **Landing Page** - Show bilingual toggle, skill chips
2. **Demo Button** - "Watch Sunita's demo" (no login required)
3. **Coach Conversation** - Show voice mode, auto-language detection
4. **Udaan Kit** - 5 tabs: Plan, Social Media, Sell & Ship, Vendors, Tips
5. **Finance Page** - Voice sales entry, bill scanning
6. **Goals** - Business-related savings goals

---

## One-Line Pitch

"Udaan uses Claude AI with RAG-verified government schemes to coach Indian women in their own language, turning skills like cooking or tailoring into their first independent income - voice-first, judgment-free, on any phone."
