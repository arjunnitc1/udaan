import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions, events } from "@/lib/db/schema";
import { SessionEventSchema } from "@/lib/validations";
import { count, eq } from "drizzle-orm";

/**
 * POST /api/session
 *
 * Logs a funnel event to the database.
 * On "session_start" it upserts the session row first (idempotent so demo
 * replays and network retries don't duplicate rows).
 *
 * Event funnel:  session_start → interview_answer → kit_generated → whatsapp_copied
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SessionEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionId, type, payload } = parsed.data;

    // Upsert the session row on the first event so all events have a parent.
    if (type === "session_start") {
      const langValue =
        payload &&
        typeof payload === "object" &&
        "lang" in payload &&
        typeof (payload as Record<string, unknown>).lang === "string"
          ? ((payload as Record<string, unknown>).lang as string)
          : "en";

      const isDemoValue =
        payload &&
        typeof payload === "object" &&
        "demo" in payload &&
        typeof (payload as Record<string, unknown>).demo === "boolean"
          ? ((payload as Record<string, unknown>).demo as boolean)
          : false;

      await db
        .insert(sessions)
        .values({ id: sessionId, lang: langValue, is_demo: isDemoValue })
        .onConflictDoNothing();
    }

    // Insert the event row (only if a parent session exists to avoid orphans).
    await db.insert(events).values({
      session_id: sessionId,
      type,
      payload: payload ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[session route error]", err);
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}

/**
 * GET /api/session
 *
 * Returns aggregated funnel counts — handy during a pilot to watch
 * drop-off between stages in real-time.
 *
 * Example response:
 * { "session_start": 42, "interview_answer": 38, "kit_generated": 31, "whatsapp_copied": 17 }
 */
export async function GET() {
  try {
    const rows = await db
      .select({ type: events.type, total: count() })
      .from(events)
      .groupBy(events.type);

    const tally = Object.fromEntries(rows.map((r) => [r.type, r.total]));
    return NextResponse.json(tally);
  } catch (err) {
    console.error("[session GET error]", err);
    return NextResponse.json(
      { error: "Could not fetch analytics." },
      { status: 500 }
    );
  }
}
