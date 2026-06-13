import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { buildSystemPrompt } from "@/lib/prompt";
import { CoachRequestSchema } from "@/lib/validations";
import type { Kit } from "@/lib/types";

// ─── AI Client ───────────────────────────────────────────────────────────────

// Check if API key is configured
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("[coach] ANTHROPIC_API_KEY is not set");
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });
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

    // 3. Check API key before calling
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("[coach] ANTHROPIC_API_KEY is not configured");
      return NextResponse.json(
        { error: "Coach is not configured. Please add your API key." },
        { status: 500 }
      );
    }

    // 4. Call Anthropic
    console.log("[coach] Calling Anthropic API with model:", MODEL);
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: buildSystemPrompt(),
      messages,
    });
    console.log("[coach] Anthropic API response received");

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

    // 5. Persist kit to DB if the model returned a completed kit (only if DB is configured)
    if (
      process.env.DATABASE_URL &&
      parsed_reply &&
      typeof parsed_reply === "object" &&
      (parsed_reply as { type?: string }).type === "kit"
    ) {
      try {
        // Dynamic import to avoid errors when DATABASE_URL is not set
        const { db } = await import("@/lib/db");
        const { kits } = await import("@/lib/db/schema");
        const sessionId = req.headers.get("x-session-id");
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
  } catch (err: unknown) {
    console.error("coach route error:", err);

    // Provide more specific error messages
    let errorMessage = "The coach could not respond. Please try again.";
    let statusCode = 500;

    if (err instanceof Error) {
      console.error("Error details:", err.message);

      // Check for specific Anthropic errors
      if (err.message.includes("API key") || err.message.includes("authentication") || err.message.includes("401")) {
        errorMessage = "API key is invalid. Please check your Anthropic API key.";
        statusCode = 401;
      } else if (err.message.includes("not_found") || err.message.includes("model")) {
        errorMessage = "AI model not available. Please check your Anthropic account has billing enabled.";
        statusCode = 503;
      } else if (err.message.includes("rate") || err.message.includes("429")) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
        statusCode = 429;
      } else if (err.message.includes("timeout") || err.message.includes("ECONNREFUSED") || err.message.includes("fetch")) {
        errorMessage = "Connection failed. Please check your internet and try again.";
        statusCode = 503;
      } else if (err.message.includes("credit") || err.message.includes("billing") || err.message.includes("payment")) {
        errorMessage = "Billing issue with AI service. Please check your Anthropic account.";
        statusCode = 402;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
