import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { buildSystemPrompt } from "@/lib/prompt";
import { CoachRequestSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { kits } from "@/lib/db/schema";
import type { Kit } from "@/lib/types";

// ─── AI Client ───────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

// ─── Rate Limiter (Upstash Redis) ────────────────────────────────────────────
// Falls back to a no-op limiter if Upstash env vars are not configured,
// so the app still works locally without Redis.

let ratelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    // 10 requests per 60 seconds per IP — protects API budget.
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
    prefix: "udaan:ratelimit",
  });
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit
    if (ratelimit) {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
      const { success, limit, remaining, reset } =
        await ratelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a minute." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(remaining),
              "X-RateLimit-Reset": String(reset),
            },
          }
        );
      }
    }

    // 2. Validate request body with Zod
    const body = await req.json();
    const parsed = CoachRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { messages } = parsed.data;

    // 3. Call Anthropic
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

    // 4. Parse JSON from model response (strip stray code fences defensively)
    const clean = text.replace(/```json|```/g, "").trim();
    let parsed_reply: unknown;
    try {
      parsed_reply = JSON.parse(clean);
    } catch {
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Model did not return JSON");
      parsed_reply = JSON.parse(match[0]);
    }

    // 5. Persist kit to DB if the model returned a completed kit
    //    Session ID is passed as a custom header so we can link kits to sessions.
    const sessionId = req.headers.get("x-session-id");
    if (
      parsed_reply &&
      typeof parsed_reply === "object" &&
      (parsed_reply as { type?: string }).type === "kit"
    ) {
      try {
        await db.insert(kits).values({
          session_id: sessionId ?? null,
          kit_json: parsed_reply as Kit,
        });
      } catch (dbErr) {
        // Non-fatal: log but don't block the response to the user.
        console.error("[kit persist error]", dbErr);
      }
    }

    return NextResponse.json({ reply: parsed_reply, raw: text });
  } catch (err) {
    console.error("coach route error:", err);
    return NextResponse.json(
      { error: "The coach could not respond. Please try again." },
      { status: 500 }
    );
  }
}
