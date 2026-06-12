import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/prompt";

// The API key lives ONLY here, on the server. Never in the browser.
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

// --- Minimal in-memory rate limiter (per serverless instance) ---
// Good enough to stop a runaway loop from draining your API budget.
// For real production scale, replace with Upstash Redis rate limiting.
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_PER_WINDOW;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const messages: ChatMessage[] = body.messages;

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
    }
    // Basic input hygiene: cap message sizes.
    for (const m of messages) {
      if (typeof m.content !== "string" || m.content.length > 2000) {
        return NextResponse.json({ error: "Message too long." }, { status: 400 });
      }
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: buildSystemPrompt(),
      messages,
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    // The model is instructed to return pure JSON; strip stray fences defensively.
    const clean = text.replace(/```json|```/g, "").trim();
    let parsed: unknown;
    try {
      parsed = JSON.parse(clean);
    } catch {
      // One retry-style fallback: extract the outermost JSON object if extra prose leaked.
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Model did not return JSON");
      parsed = JSON.parse(match[0]);
    }

    return NextResponse.json({ reply: parsed, raw: text });
  } catch (err) {
    console.error("coach route error:", err);
    return NextResponse.json(
      { error: "The coach could not respond. Please try again." },
      { status: 500 }
    );
  }
}
