import { NextRequest, NextResponse } from "next/server";

/**
 * Session/event logging endpoint.
 *
 * Today: logs to the server console and keeps an in-memory tally so the app
 * runs with ZERO database setup. Lost on redeploy — fine for a pilot demo.
 *
 * When you add Supabase/Neon (DATABASE_URL in env):
 *   1. npm install @supabase/supabase-js  (or pg / drizzle for Neon)
 *   2. Create tables:
 *        sessions(id uuid pk, started_at timestamptz, lang text)
 *        events(id bigint pk, session_id uuid, type text, payload jsonb, at timestamptz)
 *   3. Replace the in-memory block below with inserts.
 *
 * The event types the frontend sends map directly to your PM funnel:
 *   session_start → interview_answer → kit_generated → whatsapp_copied
 * Funnel drop-off between these IS your product dashboard.
 */

type EventBody = { sessionId: string; type: string; payload?: unknown };

const tally = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EventBody;
    if (!body.sessionId || !body.type) {
      return NextResponse.json({ error: "sessionId and type required" }, { status: 400 });
    }
    tally.set(body.type, (tally.get(body.type) || 0) + 1);
    console.log(`[event] ${body.type} session=${body.sessionId}`, body.payload ?? "");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}

export async function GET() {
  // Quick peek at the funnel while piloting: GET /api/session
  return NextResponse.json(Object.fromEntries(tally));
}
