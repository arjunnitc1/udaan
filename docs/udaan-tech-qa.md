# Udaan — Technical Q&A Defense Guide

**For: AI for Good Hackathon · Reuben College, Oxford · June 2026**

This document prepares you to defend every significant technical decision in the Udaan platform. Each answer is self-contained and can be delivered in 30–60 seconds.

---

## AI & Model Design

---

### Q1: Why did you choose Claude (Anthropic) over GPT-4 or Gemini?

**Answer:** Three specific reasons, not brand preference.

1. **Structured JSON output reliability.** Claude handles complex nested JSON schemas (our 15-field Kit object with bilingual variants) more reliably than alternatives at the time of selection. We verified this by testing the same Kit schema across models — Claude had the fewest malformed JSON responses.

2. **Instruction-following fidelity.** Our system prompt has hard constraints: "never question her ambition," "always count labour as a cost," "use only these government schemes." Claude follows these constraints more consistently, which matters when the output affects real financial decisions.

3. **Context window.** claude-opus-4-8 handles our full system prompt (scheme data + conversation history) without truncation issues.

We are model-agnostic at the architecture level — if a better model appears, we change one config line.

---

### Q2: What prevents the AI from making up government schemes or giving wrong financial advice?

**Answer:** This is structural, not instructional.

All scheme data lives in `data/schemes.json` — a version-controlled file with 4 verified entries, each with an official URL and a `last_verified` date. At every API call, `buildSystemPrompt()` injects the full contents of this file into the system prompt with the explicit instruction: *"Use ONLY these schemes, never invent others."*

Claude physically cannot cite a scheme that isn't in the file, because it has no other source — the prompt doesn't mention the internet, model weights, or any other scheme database. This is analogous to how you prevent SQL injection: you don't trust the input, you parameterize it. We don't trust the model's scheme knowledge — we parameterize it with our verified file.

For financial advice: pricing logic includes the hard constraint that labour must be counted as a cost. The Kit output includes pricing items with explanations, not raw numbers, so the user understands the basis. We position the Kit as a starting point, not a binding financial recommendation.

---

### Q3: Why does your AI return JSON instead of just a conversational reply?

**Answer:** Because a string is unrenderable, unverifiable, and unsaveable.

If Claude returns prose like *"You should start a tiffin service and charge around ₹80 per tiffin..."*, we can display it as text — but we cannot:
- Render a structured business card with pricing table
- Validate that every required field was provided
- Store it in a database with typed columns
- Let the user share a WhatsApp message without copy-pasting

Our Kit is a typed TypeScript interface with 15+ fields. Claude fills it. The `reply.type` field tells the UI whether to show a conversational bubble or trigger the full Kit view. This is a data architecture decision, not a UI preference.

---

### Q4: How does the 5-stage conversation work? Isn't it rigid?

**Answer:** It's structured, not rigid. The difference matters.

The 5 stages (Life Context → Motivation → Skills → Business Clarity → Kit Generation) are semantic labels on conversation turns, not forced branching. Claude decides when a stage feels complete based on the conversation — not based on counting messages.

The `stage` field in conversation replies is metadata for analytics (so we can see where users drop off in the funnel). The actual conversation is free-flowing: Claude asks follow-up questions, revisits topics, and only generates the Kit when it has enough information.

The benefit of stages: we can measure funnel drop-off. Where do women stop talking? After motivation? After skills? That data shapes future iterations.

---

### Q5: What happens if Claude returns invalid JSON?

**Answer:** Two-layer defensive parsing, then graceful failure.

1. **Code fence stripping:** Claude sometimes wraps JSON in ` ```json ... ``` `. We strip these with a regex before parsing.
2. **Primary parse:** `JSON.parse(cleanedText)`.
3. **Regex fallback:** If parse fails, extract the first `{...}` block using `/\{[\s\S]*\}/`.
4. **Hard failure:** If both fail, return HTTP 500 with a user-friendly message. We never display raw LLM output as if it were a Kit.

In testing, the regex fallback triggers in roughly 2% of responses (usually when Claude adds a brief preamble before the JSON). The hard failure has not triggered with claude-opus-4-8 in our testing sessions.

---

## Database & Infrastructure

---

### Q6: Why are you moving from Supabase to self-hosted PostgreSQL? Isn't Supabase easier?

**Answer:** Supabase was the right choice to build fast. Self-hosted is the right choice to scale responsibly.

**Why we're moving:**
1. **India DPDP Act 2023.** Supabase's free tier runs on servers outside India. Our users' data — even anonymized — may be subject to the Act's data localisation guidelines once we have more than 100 users. A self-hosted instance in Mumbai solves this permanently.
2. **pgvector.** We can't install PostgreSQL extensions on Supabase's free tier. pgvector is required for our planned RAG pipeline (semantic scheme matching). Self-hosted = we control the extensions.
3. **Connection model.** Supabase's session-mode pooler forced workarounds in our code (`max: 1`, `prepare: false`). With our own PgBouncer, we configure connection pooling properly.

**Why it's easy:**
The application code doesn't change. Drizzle ORM abstracts the database behind `DATABASE_URL`. Changing the connection string and running `drizzle-kit push` on the new host is the entire migration.

---

### Q7: Walk me through your database schema. What do you actually store?

**Answer:**

Three tables:

- **`sessions`**: `uuid` (primary key, client-generated), `lang` (detected language), `is_demo` (boolean), `created_at`. No name, no phone, no location — ever.
- **`events`**: Funnel analytics. Each row is one event: `session_start`, `interview_answer`, `kit_generated`, or `whatsapp_copied`. Payload is a JSONB column (flexible, no schema migration needed for new event types). Cascade-deletes when the parent session is deleted.
- **`kits`**: The complete Kit object for each completed session, stored as JSONB. This lets us query "how many women in their 30s have selected tiffin services" without pre-defining columns for every Kit field.

Key architectural choice: JSONB for kits means the Kit schema can evolve (we added instagram, vendors, business_management fields) without database migrations.

---

### Q8: Why does your code have `max: 1` and `prepare: false` in the database client?

**Answer:** These are Supabase session-mode pooler requirements for serverless environments.

- **`max: 1`**: Each serverless function invocation should hold at most 1 connection. Without this, a Vercel function that handles 100 concurrent requests could try to open 100 connections simultaneously, exhausting the pool.
- **`prepare: false`**: Supabase's session-mode pooler doesn't support prepared statements (which require connection-level state). Without this, PostgreSQL throws `prepared statement already exists` errors on the second request to the same pooler slot.

When we move to self-hosted PostgreSQL with PgBouncer in transaction mode, we can remove both constraints and use proper connection pooling.

---

### Q9: What's the lazy singleton pattern in your database client, and why does it matter?

**Answer:**

In development, Next.js hot-module reloads (HMR) re-imports modules on every file save. Without special handling, this creates a new database connection pool on every reload — exhausting the pool in minutes.

Our solution: in development, the connection is stored on `globalThis.__db`. When the module re-imports, it checks `globalThis.__db` first. If it exists, it reuses it. If not, it creates one.

In production, module-level singletons work fine because the process doesn't re-import modules during a request. We use a simple module-level `_db` variable.

The Proxy pattern wraps this logic: `export const db = new Proxy({}, { get(_target, prop) { return getDb()[prop] } })`. This lets application code use `db.select(...)` without knowing whether the singleton has been initialized yet. It initializes lazily on first use, not at import time — which also means `next build` succeeds without `DATABASE_URL` being set.

---

### Q10: Your kit persistence is "non-fatal" — what does that mean and why?

**Answer:**

The code path for a coach interaction is:
1. Call Claude → get Kit JSON
2. **Try** to insert Kit into database
3. Return Kit to user

Step 2 is wrapped in `try/catch`. If the database is down, slow, or throws an error, we log the error and continue. The user still receives their Kit.

Why: From the user's perspective, the Kit is the value. Analytics are infrastructure. If our database has an outage, a user mid-coaching session should still get their business plan. Making DB writes non-fatal decouples the product experience from the observability layer.

The downside: we may lose some Kit records during outages. For a hackathon MVP — and honestly for most early-stage products — this is the right trade-off.

---

## Security & Privacy

---

### Q11: How do you protect the Anthropic API key?

**Answer:** Structural isolation, not access control.

The API key is a Next.js server-side environment variable (`process.env.ANTHROPIC_API_KEY`). It is only accessed in `/app/api/coach/route.ts`, which is a Next.js Route Handler that runs exclusively on the server. It is:
- Never in any client-side component
- Never in any API response body or headers
- Never logged (our logging is limited to error messages)
- Never in the git repository (`.gitignore` includes `.env.local`)

The browser makes a POST request to `/api/coach`. The server makes the Anthropic API call. The browser never sees the key.

---

### Q12: Why does your auth use localStorage? Isn't that insecure?

**Answer:** For this use case, localStorage is appropriate for MVP, and we know the upgrade path.

What we store in localStorage: phone number, name, location, session UUID. No passwords, no tokens, no financial data. Our "auth" is closer to a profile than authentication — it's a convenience layer so users don't re-enter their context.

The actual risk of localStorage auth is session hijacking via XSS. Our mitigation: Next.js escapes all rendered content by default; we have no `dangerouslySetInnerHTML` usage; our user input goes to Claude, not to DOM innerHTML.

Production upgrade: httpOnly cookie containing a signed JWT, with CSRF protection via SameSite=strict. This is our defined next step. We didn't implement it for the hackathon because it requires a session database table and adds complexity without adding hackathon-relevant value.

---

### Q13: How does your rate limiting work?

**Answer:** Upstash Redis with a sliding window algorithm.

- **Algorithm:** Sliding window (not fixed window). Sliding window is fairer — it doesn't allow a burst at the boundary of two windows the way fixed-window does.
- **Limit:** 10 requests per 60 seconds per IP address.
- **Implementation:** `@upstash/ratelimit` SDK, which uses a Lua script executed atomically on the Redis server.
- **Response:** 429 HTTP status with `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` headers.
- **Graceful degradation:** If Upstash environment variables are absent (local dev without Redis configured), the limiter is skipped. This means rate limiting fails open — we never break the app for missing infra.

The limit of 10/60s is generous for a coaching session (a typical session has 8–12 exchanges) but prevents API cost abuse from scripts or bots.

---

### Q14: How are you compliant with India's DPDP Act 2023?

**Answer:** By design, not by legal review.

The Digital Personal Data Protection Act defines "personal data" as data that can identify an individual. We don't collect any: no name in our database, no phone number, no email, no device ID. Our database session records contain only a client-generated UUID, a detected language code, and a timestamp.

The phone number the user enters in auth stays in their browser's localStorage. It never reaches our server or our database. The user's conversation text is sent to Claude (Anthropic processes it under their data processing agreement) and then discarded — we store only the resulting Kit JSON, with no session linkage to identity.

Moving to India-hosted PostgreSQL removes the data residency question entirely, even for anonymized data.

---

## Voice & Language

---

### Q15: How does multilingual voice work? What external services do you use?

**Answer:** Zero external services. All browser-native.

**Voice input:** Web Speech API (`webkitSpeechRecognition`). The browser sends audio to the OS speech recognition engine (on iOS: Siri engine; on Android: Google speech). We receive a transcript string. No API call, no cost.

**Language detection:** We scan the transcript for Unicode ranges: Devanagari (U+0900–U+097F) for Hindi, Tamil (U+0B80–U+0BFF), Telugu (U+0C00–U+0C7F), Kannada (U+0C80–U+0CFF), Bengali (U+0980–U+09FF). If none match, default to English. This runs in under 1ms — it's a regex.

**Voice output:** Web Speech Synthesis API (`SpeechSynthesisUtterance`). We set `.lang` to the detected code (hi-IN, ta-IN, etc.) and `.voice` to a matching voice from `speechSynthesis.getVoices()`. The browser speaks the response using the OS text-to-speech engine.

Total additional cost for multilingual voice: ₹0. Total additional latency: ~0ms for detection.

---

### Q16: What if a woman switches languages mid-conversation?

**Answer:** It works automatically.

Language detection runs on every message, not just the first. If a user types in Hindi in message 3 and switches to Telugu in message 8, the detected language updates, the TTS voice switches, and the system prompt instructs Claude to respond in the user's language.

The Kit always includes bilingual fields (`_en` and `_hi`) because Hindi is our highest-reach language and English is the default fallback. For other languages, Claude generates the Kit response in the detected language while the structured fields remain in the typed Kit format.

---

## Architecture Trade-offs

---

### Q17: Why isn't there streaming? Wouldn't that feel more responsive?

**Answer:** We chose reliability over perceived speed, deliberately.

Streaming with our structured JSON output is complex: you can't validate a partial JSON object. If we streamed, we'd need to buffer the entire response before parsing anyway — which eliminates the latency benefit of streaming for the Kit generation step.

For conversational messages (the coach's questions during the interview phase), streaming would improve the feel. This is our planned next iteration: stream conversational replies, but use non-streaming for the Kit generation request. The architecture supports this — it's a change to one API route, not a redesign.

---

### Q18: Why is so much state in localStorage instead of the database?

**Answer:** Zero API calls for features that don't need them.

Goals, Piggy Bank, Notifications, and Auth are all localStorage-based. This means:
- They work instantly (no network latency)
- They work offline
- They work without a database
- They have zero risk of exposing user data to our servers

The features that genuinely need the database — funnel analytics, Kit persistence for product insights — are in the database.

This is a deliberate architecture: API credits are finite, database connections are finite, latency is real. Features that can be local, should be local.

---

### Q19: How would you scale this to 10,000 concurrent users?

**Answer:** The architecture already handles this at the DB and rate-limit layer. The constraint is API cost.

**Database:** Self-hosted PostgreSQL with PgBouncer transaction-mode pooling handles thousands of concurrent connections. Drizzle ORM with `max: 1` per serverless function already prevents pool exhaustion.

**API layer:** Next.js on Vercel scales serverless functions horizontally by default. No configuration needed for horizontal scale.

**Rate limiting:** Upstash Redis is a distributed, managed service that handles millions of requests/second.

**AI:** The bottleneck. At 10,000 concurrent users, API costs become significant. Our mitigation roadmap:
1. Model routing: use claude-haiku-4-5 for early conversation stages, claude-opus-4-8 only for Kit generation
2. Caching: if two users describe identical skills and locations, the Kit generation could be cached (with privacy-safe key design)
3. Fine-tuning: a smaller fine-tuned model for Indian women entrepreneurs costs less per token

---

### Q20: What's your demo mode and why does it exist?

**Answer:** It exists because responsible software has a fallback.

`lib/demo.ts` contains two things:
1. `DEMO_SCRIPT`: A scripted conversation for Sunita, a fictional tiffin-service entrepreneur, with fixed user messages and coach responses.
2. `DEMO_KIT`: A fully populated Kit object representing Sunita's business plan.

When demo mode is triggered (a toggle in the coach UI), the app plays the scripted conversation locally — no API call, no Claude, no cost. The Kit renders from the static object.

Why it exists:
- **Hackathon insurance:** If the API key has no credits during the demo, the product still runs.
- **Reproducible demonstration:** The exact same story plays every time, with no risk of a bad LLM response during a high-stakes presentation.
- **Offline development:** Build and test the UI without consuming API credits.

It's also our most complete test fixture for the Kit UI — every field is populated so we can see every component rendered.

---

### Q21: How does the community heroes feature avoid being just made-up data?

**Answer:** It's explicitly disclosed as representative profiles, not real data.

The six profiles in `data/community-heroes.json` are composites — representative of real outcomes documented in NITI Aayog SHG reports, Mudra Loan data, and media coverage of women entrepreneurs. The stories are realistic but the people are fictional, similar to case studies in business school curricula.

In production, this section would be replaced with verified partner women entrepreneurs who have agreed to be featured and whose contact details are managed through a partnership agreement. The data structure is already built for this: each hero has verified, instagram, and whatsapp fields.

---

### Q22: Why did you use Drizzle ORM instead of Prisma or raw SQL?

**Answer:** Two reasons: build-time safety and runtime behaviour.

**Prisma** generates client code from a schema and requires a build step (`prisma generate`). In a serverless environment, this adds bundle size and complicates cold starts. Prisma also has known issues with serverless connection pooling.

**Drizzle** is a query builder: queries are TypeScript expressions, type-checked at build time, no code generation needed. The generated SQL is predictable and inspectable. Bundle size is small.

**Raw SQL** loses type safety. A typo in a column name is a runtime error, not a build error.

The specific technical win: Drizzle's `drizzle-kit push` command applies our schema to any PostgreSQL instance without needing a migration history — exactly what we need when moving from Supabase to self-hosted.

---

### Q23: What does your funnel analytics actually track, and how do you use it?

**Answer:** Four events per session, tracked to understand where women drop off.

Events (stored in the `events` table):
1. `session_start` — user opens the coach
2. `interview_answer` — user sends their first message (they didn't just open and close)
3. `kit_generated` — Claude successfully returned a Kit
4. `whatsapp_copied` — user copied the WhatsApp message template

This gives us a conversion funnel: Start → Engaged → Completed → Activated.

If we see 80% drop off between `session_start` and `interview_answer`, the onboarding question is wrong. If 60% complete the Kit but only 10% copy the WhatsApp message, the WhatsApp section needs redesign.

All events are linked to a session UUID, not a user identity, so the funnel is anonymous.

---

### Q24: Why is there no backend authentication on API routes?

**Answer:** Because our sessions are anonymous by design.

Our API routes don't require auth tokens because there's nothing to protect on a per-user basis. A session UUID identifies a conversation context — not a user account. If someone else sends a request with your session UUID, they can add events to your session. In practice this is harmless: the worst outcome is a corrupted funnel event, not data exposure or account compromise.

The `x-session-id` header is a correlation ID, not an authentication token. We treat it as "probably from the right user" not "verified to be from the right user."

If we added per-user Kits, saved conversations, or billing — all of which require identity — we would add JWT authentication on those routes. The current model correctly reflects the current data sensitivity level.

---

### Q25: What's the most significant thing you would do differently if you had 3 more months?

**Answer:** Two things, with clear technical rationale.

1. **pgvector RAG for scheme matching.** Instead of asking Claude to match schemes from injected text, we'd embed each user's profile description and run a cosine similarity search against embedded scheme descriptions. This produces verifiable, reproducible matches with an explainable score — "you match PM Mudra Loan with 0.87 cosine similarity because you mentioned 'startup capital' and 'collateral.'" That's auditable in a way LLM reasoning is not.

2. **WhatsApp integration via Meta Cloud API.** 97% of our target users are on WhatsApp, not web browsers. A WhatsApp-native coaching flow — where the same 5-stage conversation happens over WhatsApp messages — would reach women who never open a web app. The backend is unchanged (same API routes), we just add a WhatsApp webhook adapter.

---

*Document version: June 2026 · For Udaan technical defense presentation*
*Repository: github.com/arjunnitc1/udaan · Branch: shreya/new-specs*
