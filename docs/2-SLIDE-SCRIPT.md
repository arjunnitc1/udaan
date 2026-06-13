# Your 2-Slide Presentation Script

Simple talking points in plain language.

---

## SLIDE 1: Tech Stack & Architecture

### What to say:

**Start with the big picture:**
> "Let me walk you through how Udaan is built and why we made these choices."

**Frontend:**
> "We use Next.js 14 with TypeScript. Why? Because it works on any phone browser — no app download needed. A woman in a village doesn't need to go to Play Store. She just opens a link."

**Voice:**
> "Voice input and output uses the browser's built-in Web Speech API. This means:
> - No extra cost for us
> - Works in Hindi, Bengali, Tamil
> - Even works offline for the demos
>
> She can speak naturally — the browser converts it to text, we send it to Claude, and the browser speaks the response back."

**AI/Backend:**
> "For the coaching brain, we use Claude API. Why Claude over GPT? Two reasons:
> 1. Better at following complex instructions — we have very specific rules about how to talk to these women
> 2. Doesn't randomly break character — GPT sometimes ignores system prompts"

**Database:**
> "Supabase for storing sessions and analytics. We track the funnel — how many start, how many finish, how many actually send that first WhatsApp message."

**The Scheme Data:**
> "This is important — we have a curated JSON file with real government schemes. Mudra loans, Udyam registration, PM Vishwakarma, state schemes. Each has eligibility rules. The AI can ONLY recommend from this list. It cannot make up schemes."

**Offline-first:**
> "The demos work completely offline. Why? Because internet in rural India is unreliable. She can explore all 4 demo stories, see full business kits, understand the app — all without internet. When she's ready to do her own conversation, then she needs connectivity."

### Key points to remember:
- No app download — just browser
- Voice is free (browser API)
- Claude for better instruction-following
- Schemes are curated, not generated
- Demos work offline

---

## SLIDE 2: Why This Is NOT a Wrapper

### What to say:

**Start strong:**
> "Now, the big question — isn't this just a ChatGPT wrapper with a nice UI? No. Let me explain why."

**Point 1: Curated Data Layer**
> "If you ask ChatGPT about Indian government schemes for women, it will hallucinate. It might tell you about schemes that don't exist or got discontinued in 2019.
>
> We have a curated database of real schemes with eligibility criteria. The AI retrieves from this database — it doesn't generate scheme information. This is RAG — Retrieval Augmented Generation. The AI can only cite what we've verified."

**Point 2: Deterministic Pricing Engine**
> "When Udaan says 'charge ₹80 per tiffin', that's not the AI guessing. We have pricing logic in code:
> - Material cost + labor at ₹50/hour minimum + 20% margin
>
> The AI asks questions, code calculates, AI presents. The numbers are auditable, not hallucinated."

**Point 3: Behavioral Guardrails**
> "This is the most important one. If you ask ChatGPT to help an Indian woman start a business, it might say 'discuss with your family first' or 'make sure your husband agrees.'
>
> Our system prompt explicitly forbids this. The AI will NEVER:
> - Question whether she should work
> - Suggest asking for permission
> - Undervalue her labor
>
> These aren't features — they're values encoded into the system. A wrapper doesn't do this."

**Point 4: Works Without API**
> "Here's something a wrapper can't do — work without the API. Our demos are fully scripted conversations with pre-built business kits. A user can experience the entire app, understand what it does, get inspired — all without hitting Claude once.
>
> This is important for:
> - Poor connectivity areas
> - Cost management
> - Demos that never fail"

**Point 5: Domain-Specific Output Structure**
> "ChatGPT gives you text. We give you a structured business kit:
> - 3 business ideas with income ranges
> - Pricing table with exact amounts
> - WhatsApp message ready to copy
> - Government schemes with eligibility
> - Week-1 action plan
> - Instagram bio and hashtags
>
> This structure is enforced. The AI must return valid JSON matching our schema. A wrapper just shows whatever the AI says."

### Closing:
> "So to summarize — we have a curated data layer, deterministic calculations, behavioral guardrails, offline capability, and structured outputs. That's not a wrapper. That's a product."

### Key points to remember:
- Schemes are retrieved, not generated (RAG)
- Pricing is calculated in code, not by AI
- Behavioral rules prevent harmful suggestions
- Works offline — wrapper can't do that
- Output is structured JSON, not free text

---

## Quick Cheat Sheet

| Wrapper Does | Udaan Does |
|--------------|------------|
| Passes user input to API | Passes input + curated scheme data + pricing rules |
| Shows whatever AI returns | Enforces structured JSON output |
| AI can say anything | AI has strict behavioral guardrails |
| Needs internet always | Demos work offline |
| AI generates everything | AI + deterministic code together |
| Generic responses | India-specific, Hindi-first, women-focused |

---

## If Judges Push Back

**"But you're still using Claude, so it's still a wrapper"**
> "By that logic, every AI product is a wrapper. The value is in the data layer, the guardrails, the structure, and the offline experience. Claude is the engine, but we built the car."

**"Can't someone just prompt ChatGPT to do this?"**
> "Try it. Ask ChatGPT for Indian women's business schemes. It will hallucinate. Ask it to never suggest asking permission. It will forget after 3 messages. The system prompt engineering and data curation is the product."

**"What's your moat?"**
> "Three things: The curated scheme database that we maintain, the behavioral design that took months to get right, and the trust we build with SHGs and NGOs for distribution. Anyone can copy the UI. They can't copy the relationships."

---

Good luck! 🪁
