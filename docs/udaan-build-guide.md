# Udaan — Build Guide & Next Steps

How to take this package from "prototype on a laptop" to "demo that wins" to "live product on your CV." Three horizons: **hackathon day**, **week after**, **month after**.

---

## What's in the package

| File | What it is | How you use it |
|---|---|---|
| `udaan-prd.md` | One-page PRD | Hand to team at hour zero. Resolves every scope debate. |
| `udaan-prototype.html` | Working AI-powered prototype | Open in Chrome. This is your demo. |
| `udaan-pitch.pptx` | 10-slide pitch deck | Pitch lead owns it; insert live demo at slide 5. |
| `udaan-build-guide.md` | This file | Your roadmap. |

---

## Horizon 1 — Hackathon day (hour-by-hour)

### Hour 0–1: Align
1. Team reads the PRD (10 min). Vote to commit. No re-litigating scope after this.
2. Assign roles (PRD §13). You drive product + build; pitch lead starts on the deck narrative immediately — the deck and the demo are built **in parallel**, never sequentially.
3. Find out who the judges are. Corporate/VC panel → lead with the income + multiplier slides. Social-impact panel → lead with Sunita.

### Hour 1–3: Make the prototype yours
The prototype already works two ways:
- **Live AI mode** ("Talk to your coach") — calls Claude through the artifact API. Best inside Claude.ai as an Artifact.
- **Offline demo mode** ("Watch Sunita's demo") — fully scripted, zero network needed. This is your stage insurance.

Tasks:
1. **Recreate it as a Claude Artifact** (recommended): open Claude.ai, paste the HTML and say "turn this into an artifact." Inside an artifact, the `api.anthropic.com` calls work without any API key — this is the fastest path to a live AI demo.
2. **Iterate the system prompt** — it's the `SYSTEM_PROMPT` constant at the top of the script. This is your product craft. Test with 10+ inputs: tailoring, tuition, mehendi, gibberish, English-only, a hostile judge asking something off-topic. Tighten until every output feels like a wise elder sister, never a lecture.
3. **Content lead**: review all Hindi copy for naturalness; verify scheme facts against official portals (udyamregistration.gov.in, mudra.org.in, nrlm.gov.in, pmvishwakarma.gov.in).

### Hour 3–5: Optional "real deployment" track (the CV upgrade)
If the demo is stable, port to a deployed app with Claude Code:
1. Install Claude Code (native installer from the official docs; requires a Pro/Max/Team plan or API credits).
2. In an empty folder: `claude` → then prompt it:
   > "Scaffold a Next.js app replicating this single-file prototype [paste/attach the HTML]. Move the Claude API call to a serverless route using the Anthropic SDK with an ANTHROPIC_API_KEY env var. Keep the design identical. Add a /api/coach route, deploy-ready for Vercel."
3. Get an API key from console.anthropic.com, set it as a Vercel environment variable, `git push`, import to Vercel, deploy.
4. Result: a **live URL + public GitHub repo** — the two links that make the CV line real.

Skip this track without guilt if time is tight; the Artifact demo is enough to win.

### Hour 5–6: Harden
- Screen-record a perfect demo run (your Plan B video).
- Run the adversarial test list (QA teammate): empty input, very long input, pure English, pure Hindi, mid-conversation language switch, airplane mode (→ demo mode still works).
- Feature freeze. Nothing new after this. Nothing.

### Hour 6–8: Rehearse and pitch
- Three full rehearsals, timed. One with a non-team-member giving the demo input.
- Pitch order: Sunita's story (slide 3 energy) → **live demo** → why-not-ChatGPT → market/multiplier → distribution/model → honest risks → vision close.
- Closing line is on slide 10. Let it land, then stop talking.

---

## Horizon 2 — The week after (CV + portfolio)

1. **Deploy if you didn't** (Claude Code track above). Live URL + repo.
2. **Write the CV line:**
   > "Led product and co-built Udaan, an AI business coach that converts Indian women's existing skills into launch-ready micro-businesses (pricing, WhatsApp storefront, government-scheme matching) — owned PRD, system-prompt design and build using Claude/Anthropic API; [won X / shortlisted] at [hackathon], deployed at [URL]."
3. **Write a LinkedIn post** — the Sunita story, 3 screenshots, what you learned about building with AI, tag teammates. This post does more for your engineer-to-product-strategist narrative than the CV line does.
4. **Portfolio page**: PRD + deck + demo video + repo link in one Notion page. This is the artifact you show in A&M / BearingPoint conversations when asked "tell me about a product you've driven end-to-end."

---

## Horizon 3 — The month after (if you want it to be real)

1. **One real user test.** Find 3–5 women through any NGO/SHG contact (even via family in India) and watch them use it on a phone. One hour of real usage will teach you more than the entire hackathon.
2. **WhatsApp bot MVP** — the honest distribution answer. Twilio's WhatsApp API or Meta's Cloud API + the same system prompt = Udaan with zero install friction.
3. **Curated scheme database** — replace prompt-embedded scheme facts with a small verified JSON file (name, eligibility, documents, official link, last-verified date). This kills the hallucination risk properly.
4. **Measure the north star**: of the women who got a kit, how many sent the WhatsApp message? How many got one order? Even n=5 data turns Udaan from a hackathon project into evidence — and into a genuinely strong Entrepreneurship Project or impact-startup story.

---

## Technical notes you'll want mid-build

- **Voice input** uses the browser's Web Speech API (`hi-IN` / `en-IN`); works in Chrome, not all browsers — demo on Chrome.
- **The API call** in the prototype uses the artifact-style endpoint (no key in the file). Outside Claude.ai you must proxy it server-side with your own key — never put an API key in client-side code.
- **JSON discipline:** the system prompt forces JSON-only replies and the parser strips stray markdown fences. If you edit the prompt, keep the output contract intact or the kit won't render.
- **Model choice:** Sonnet-class for speed during the live demo; latency is part of stage presence.
- **The demo-mode content** (Sunita's scripted run) doubles as your test fixture and your video script — keep it updated as the kit format evolves.
