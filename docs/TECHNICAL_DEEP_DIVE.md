# Udaan: Technical Deep Dive

## Executive Summary

**Udaan** (उड़ान, meaning "flight" in Hindi) is an AI-powered business coach designed to help Indian women transform their existing skills into independent income streams. This document provides a comprehensive technical overview for the Claude Builder Club Hackathon judges.

---

## 1. Problem Statement & Technical Solution

### The Problem
- 195+ million Indian women have marketable skills but no business knowledge
- They lack access to business coaching, pricing strategies, and government schemes
- Language barriers prevent access to existing resources (most are English-only)
- Fear of judgment prevents seeking help

### Our Technical Solution
An AI coach that:
1. Conducts empathetic, conversational interviews in 6+ Indian languages
2. Generates personalized "Udaan Kits" with business plans, pricing, and schemes
3. Provides voice-first interaction for users with low digital literacy
4. Uses RAG (Retrieval-Augmented Generation) to prevent hallucination of government schemes

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router │ React 18 │ Web Speech API │ localStorage│
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Edge/Serverless)                 │
├─────────────────────────────────────────────────────────────────┤
│  /api/coach    │  /api/session   │  Rate Limiting (Upstash)     │
│  Zod Validation│  Funnel Events  │  10 req/60s per IP           │
└───────────────┬─────────────────────────────────────────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌──────────────┐  ┌──────────────────────┐
│  Anthropic   │  │  Supabase Postgres   │
│  Claude API  │  │  (Drizzle ORM)       │
│  Sonnet 4    │  │  sessions/events/kits│
└──────────────┘  └──────────────────────┘
```

---

## 3. Tech Stack Deep Dive

### 3.1 Frontend Framework: Next.js 14 (App Router)

**Why Next.js 14 over alternatives:**

| Alternative | Why We Chose Next.js Instead |
|-------------|------------------------------|
| Create React App | No SSR, poor SEO, no API routes, deprecated |
| Remix | Less mature ecosystem, smaller community |
| Vite + React | No built-in API routes, separate backend needed |
| SvelteKit | Smaller talent pool, less React ecosystem compatibility |

**Key Next.js Features Used:**
- **App Router**: File-based routing with layouts for consistent navigation
- **API Routes**: Serverless functions for `/api/coach` and `/api/session`
- **Server Components**: Faster initial page loads (though we use mostly client components for interactivity)
- **Built-in optimization**: Automatic code splitting, image optimization

```typescript
// Example: App Router structure
app/
├── layout.tsx      // Root layout with AuthProvider, LangProvider
├── page.tsx        // Landing page (public)
├── auth/page.tsx   // OTP authentication
├── dashboard/page.tsx
├── coach/page.tsx  // Main AI coach interface
├── finance/page.tsx
├── api/
│   ├── coach/route.ts    // Anthropic Claude integration
│   └── session/route.ts  // Analytics events
```

### 3.2 AI/LLM: Anthropic Claude (Sonnet 4)

**Why Claude over alternatives:**

| Alternative | Why Claude Was Preferred |
|-------------|--------------------------|
| GPT-4 | Claude has better instruction following for structured JSON output |
| Gemini | Claude's Constitutional AI better handles sensitive coaching conversations |
| Llama/Open Source | Requires infrastructure, less reliable for production |
| GPT-3.5 | Insufficient reasoning for complex business planning |

**Key Implementation Details:**

```typescript
// lib/prompt.ts - System prompt engineering
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1500,
  system: buildSystemPrompt(), // Injected with verified schemes
  messages,
});
```

**Prompt Engineering Innovations:**

1. **Structured JSON Output**: Forces consistent output format for UI rendering
2. **RAG for Government Schemes**: Injects verified scheme data to prevent hallucination
3. **Cultural Sensitivity**: Prompt explicitly forbids questioning whether women should work
4. **Labor Costing Rule**: Always counts the woman's time as a cost when pricing

```typescript
// From lib/prompt.ts
`VERIFIED GOVERNMENT SCHEMES — use ONLY these, never invent others:
${schemes}` // Injected from data/schemes.json
```

### 3.3 Database: Supabase Postgres + Drizzle ORM

**Why this combination:**

| Alternative | Why Supabase + Drizzle |
|-------------|------------------------|
| MongoDB | Relational data (sessions → events → kits) fits SQL better |
| Prisma | Drizzle has better TypeScript inference, smaller bundle |
| Raw SQL | Drizzle provides type safety without runtime overhead |
| Firebase | Postgres is more flexible for analytics queries |

**Schema Design:**

```typescript
// lib/db/schema.ts
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  lang: text("lang").notNull().default("en"),
  is_demo: boolean("is_demo").notNull().default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: bigint("id").generatedAlwaysAsIdentity().primaryKey(),
  session_id: uuid("session_id").references(() => sessions.id),
  type: text("type").notNull(), // session_start | interview_answer | kit_generated | whatsapp_copied
  payload: jsonb("payload"),
});

export const kits = pgTable("kits", {
  id: bigint("id").generatedAlwaysAsIdentity().primaryKey(),
  session_id: uuid("session_id").references(() => sessions.id),
  kit_json: jsonb("kit_json").notNull(), // Full Kit stored for analytics
});
```

**Lazy Singleton Pattern** (for serverless compatibility):

```typescript
// lib/db/index.ts
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    return getDb()[prop as keyof DrizzleDb]; // Only connects on first use
  },
});
```

### 3.4 Rate Limiting: Upstash Redis

**Why Upstash:**
- Serverless-native (no persistent connections needed)
- Sub-millisecond latency
- Pay-per-request pricing for hackathon budget
- Built-in sliding window algorithm

```typescript
// api/coach/route.ts
const ratelimit = new Ratelimit({
  redis: new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: ... }),
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute per IP
  analytics: true,
  prefix: "udaan:ratelimit",
});
```

### 3.5 Input Validation: Zod

**Why Zod over alternatives:**

| Alternative | Why Zod |
|-------------|---------|
| Yup | Zod has better TypeScript inference |
| Joi | Zod is lighter, designed for TypeScript |
| io-ts | Zod has simpler API |
| Manual validation | Zod provides type safety and runtime validation |

```typescript
// lib/validations.ts
export const CoachRequestSchema = z.object({
  messages: z
    .array(z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000),
    }))
    .min(1, "At least one message is required.")
    .max(20, "Conversation too long."),
});
```

### 3.6 Voice Interface: Web Speech API

**Why native Web Speech API:**

| Alternative | Why Web Speech API |
|-------------|-------------------|
| Google Cloud Speech | Cost per request, added latency |
| AWS Transcribe | Requires backend, adds complexity |
| Whisper | Requires GPU/backend infrastructure |
| Assembly AI | Additional cost and latency |

**Implementation:**

```typescript
// Voice recognition (Speech-to-Text)
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = new SR();
rec.lang = "hi-IN"; // Supports Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam
rec.interimResults = true;

// Text-to-Speech for coach responses
const synth = window.speechSynthesis;
const utt = new SpeechSynthesisUtterance(text);
utt.lang = "hi-IN";
utt.rate = 0.92; // Slightly slower for clarity
synth.speak(utt);
```

---

## 4. Key Technical Innovations

### 4.1 RAG-Based Scheme Matching (Anti-Hallucination)

**Problem**: LLMs hallucinate government schemes that don't exist.

**Solution**: Inject verified scheme data directly into the system prompt.

```json
// data/schemes.json
{
  "schemes": [
    {
      "id": "mudra",
      "name": "PM Mudra Loan",
      "what_en": "Collateral-free bank loan...",
      "what_hi": "बिना गारंटी का बैंक लोन...",
      "fits": ["needs equipment", "cooking", "tailoring"],
      "official_url": "https://www.mudra.org.in",
      "last_verified": "2026-06"
    }
  ]
}
```

The model can ONLY recommend schemes from this verified list.

### 4.2 Bilingual Output Architecture

Every user-facing string has `_en` and `_hi` variants:

```typescript
// lib/types.ts
export type Kit = {
  intro_en?: string;
  intro_hi?: string;
  businesses: {
    name_en?: string;
    name_hi?: string;
    // ...
  }[];
  // All fields are bilingual
};
```

UI rendering:
```typescript
const bi = (en?: string, hi?: string) =>
  (lang === "hi" ? hi || en || "" : en || hi || "");

// Usage
<div>{bi(kit.intro_en, kit.intro_hi)}</div>
```

### 4.3 Voice-First Sales Tracking

```typescript
// Finance page voice parsing
const INCOME_KEYWORDS = ["sold", "earned", "बेचा", "कमाया", "मिला"];
const EXPENSE_KEYWORDS = ["spent", "paid", "खर्च", "दिया"];

function parseVoiceInput(text: string) {
  // Detect transaction type from keywords
  // Extract amount using regex: /₹?\s*(\d+)|(\d+)\s*(?:rupees?|रुपये)/i
  // Auto-categorize based on context
}
```

### 4.4 Offline-First Demo Mode

```typescript
// lib/demo.ts
export const DEMO_SCRIPT = [
  { who: "coach", en: "Namaste! Tell me about yourself...", hi: "नमस्ते!..." },
  { who: "user", en: "I'm Sunita from Varanasi...", hi: "मैं सुनीता हूँ..." },
  // Pre-scripted conversation
];

export const DEMO_KIT = {
  // Complete pre-generated Kit for demo
};
```

This allows the app to work without API calls for demonstrations.

---

## 5. Security & Privacy Considerations

### 5.1 No PII Storage
- Sessions are keyed by client-generated UUIDs
- Phone numbers stored only in localStorage (client-side)
- No personal names stored in database

### 5.2 Rate Limiting
- 10 requests per 60 seconds per IP
- Prevents API abuse and cost overruns

### 5.3 Input Validation
- All API inputs validated with Zod schemas
- Max message length: 2000 characters
- Max conversation length: 20 messages

### 5.4 API Key Security
- `ANTHROPIC_API_KEY` is server-side only
- Never exposed to browser bundle

---

## 6. Scalability Considerations

### Current Architecture Supports:
- **Horizontal scaling**: Serverless functions auto-scale
- **Database pooling**: Supabase session-mode pooler handles concurrent connections
- **Edge caching**: Static pages are pre-rendered

### Future Improvements:
1. **Response streaming**: Stream Claude responses for faster perceived latency
2. **Kit caching**: Cache similar Kits to reduce API calls
3. **Multi-region deployment**: Vercel edge functions closer to Indian users
4. **Offline PWA**: Service worker for areas with poor connectivity

---

## 7. Metrics & Analytics

### Funnel Events Tracked:
```typescript
type: "session_start"      // User begins conversation
type: "interview_answer"   // Each message sent
type: "kit_generated"      // Business plan created
type: "whatsapp_copied"    // High-intent action (likely to convert)
```

### North Star Metric:
**Kit Generation Rate** → Proxy for "women who got a business plan"

---

## 8. Potential Judge Questions & Answers

### Q1: "Why is this not just a ChatGPT wrapper?"

**A**: Several technical innovations make this more than a wrapper:

1. **RAG-based scheme matching**: We inject verified government scheme data to prevent hallucination. ChatGPT would make up schemes.

2. **Structured output enforcement**: The system prompt enforces JSON output with bilingual fields, enabling a rich UI experience.

3. **Domain-specific prompt engineering**: The prompt encodes feminist economic principles (always count her labor as cost, never question whether she should work).

4. **Voice-first architecture**: Native Web Speech API integration for low-literacy users.

5. **Offline demo mode**: Complete demo flow works without API calls.

### Q2: "How do you prevent the AI from giving bad advice?"

**A**: Multiple guardrails:

1. **Scheme hallucination prevention**: Only verified schemes from our curated JSON are injected. The model cannot recommend schemes outside this list.

2. **Conservative projections**: Prompt instructs "realistic small-town Indian prices, conservative earnings."

3. **Disclaimer enforcement**: All projections labeled as estimates, not guarantees.

4. **Cultural safety**: Prompt explicitly forbids questioning whether women should work or suggesting they ask permission.

### Q3: "Why Anthropic Claude over GPT-4?"

**A**: Three reasons:

1. **Instruction following**: Claude more reliably produces valid JSON without markdown wrapping.

2. **Constitutional AI**: Better at handling sensitive topics (women's autonomy, financial advice) without being preachy.

3. **Cost-performance**: Claude Sonnet offers better reasoning at lower cost than GPT-4.

### Q4: "How would this scale to millions of users?"

**A**: Current architecture already supports scale:

1. **Serverless**: Next.js API routes auto-scale on Vercel.

2. **Database pooling**: Supabase session-mode pooler handles thousands of concurrent connections.

3. **Rate limiting**: Upstash Redis protects against abuse.

**Future optimizations**:
- Response streaming for faster perceived latency
- Kit caching for similar business types
- Edge deployment closer to Indian users

### Q5: "What's your data privacy approach?"

**A**: Privacy-first design:

1. **No PII in database**: Sessions keyed by random UUIDs, not phone numbers.

2. **Client-side storage**: User profiles, transactions, and goals stored in localStorage.

3. **Server-side API keys**: Anthropic key never exposed to browser.

4. **Minimal data collection**: Only funnel events for product improvement.

### Q6: "How do you handle multiple languages?"

**A**: Multi-layered approach:

1. **Script detection**: Regex detects Devanagari, Tamil, Telugu, Bengali scripts.

2. **Bilingual output**: Every Kit field has `_en` and `_hi` variants.

3. **Voice recognition**: Web Speech API supports `hi-IN`, `bn-IN`, `ta-IN`, `te-IN`, `kn-IN`, `ml-IN`.

4. **UI translations**: `COMMON_UI` object provides translations for all 4 supported languages.

### Q7: "What happens if the API is down?"

**A**: Graceful degradation:

1. **Demo mode**: Complete pre-scripted demo works offline.

2. **Error messages**: Clear, actionable error messages in both languages.

3. **Local features**: Finance tracking, goals, piggy bank all work offline (localStorage).

### Q8: "How do you validate the business advice quality?"

**A**: Multiple validation layers:

1. **Prompt engineering**: Extensive iteration on system prompt with real user scenarios.

2. **Scheme verification**: All government schemes manually verified against official portals with `last_verified` dates.

3. **Conservative estimates**: Prompt instructs realistic pricing based on actual small-town Indian economics.

4. **Demo as test fixture**: `DEMO_KIT` serves as a regression test for output quality.

---

## 9. Code Quality & Best Practices

### TypeScript Strict Mode
- All components and functions fully typed
- No `any` types (except where interfacing with Web Speech API)

### Separation of Concerns
```
lib/
├── auth.tsx        # Authentication context
├── language.tsx    # i18n context
├── prompt.ts       # AI prompt engineering
├── types.ts        # Shared TypeScript types
├── validations.ts  # Zod schemas
├── db/
│   ├── index.ts    # Database connection
│   └── schema.ts   # Drizzle schema
```

### Error Handling
- All API routes wrapped in try-catch
- Graceful fallbacks for missing environment variables
- User-friendly error messages in both languages

---

## 10. Deployment & DevOps

### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "cd udaan-app && npm run build",
  "outputDirectory": "udaan-app/.next",
  "installCommand": "cd udaan-app && npm install"
}
```

### Environment Variables Required
```env
ANTHROPIC_API_KEY=sk-ant-...        # Required for AI coach
ANTHROPIC_MODEL=claude-sonnet-4-... # Optional, defaults to Sonnet 4
DATABASE_URL=postgres://...          # Required for analytics
UPSTASH_REDIS_REST_URL=...          # Optional, enables rate limiting
UPSTASH_REDIS_REST_TOKEN=...        # Optional, enables rate limiting
```

---

## Conclusion

Udaan represents a thoughtful application of AI technology to a real-world problem affecting millions of Indian women. The technical architecture prioritizes:

1. **User empathy**: Voice-first, multilingual, judgment-free
2. **Safety**: RAG for scheme accuracy, conservative financial advice
3. **Accessibility**: Works on any phone, any network condition
4. **Scalability**: Serverless-first, cost-efficient
5. **Privacy**: Minimal data collection, no PII storage

The combination of Claude's conversational AI with carefully engineered prompts and a curated knowledge base creates an experience that goes far beyond a "chatbot wrapper" - it's a culturally-sensitive, technically-sound tool for economic empowerment.

---

*Built at AI for Good Hackathon, Oxford, June 2026*
