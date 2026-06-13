-- Udaan — Production database schema
-- Run via: npm run db:push  (Drizzle Kit handles this for you)
-- Or paste directly into Supabase → SQL Editor if you prefer.

CREATE TABLE IF NOT EXISTS sessions (
  id          uuid PRIMARY KEY,
  lang        text NOT NULL DEFAULT 'en',
  is_demo     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  uuid REFERENCES sessions(id) ON DELETE CASCADE,
  type        text NOT NULL,
  payload     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast per-session event lookups
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
-- Index for fast funnel aggregation by type
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);

CREATE TABLE IF NOT EXISTS kits (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  uuid REFERENCES sessions(id) ON DELETE CASCADE,
  kit_json    jsonb NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kits_session_id ON kits(session_id);
