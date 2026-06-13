import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  bigint,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * sessions — one row per coaching session.
 * Keyed by a client-generated UUID so we store no PII.
 */
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  lang: text("lang").notNull().default("en"),
  is_demo: boolean("is_demo").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * events — funnel events per session.
 * Types: session_start | interview_answer | kit_generated | whatsapp_copied
 */
export const events = pgTable("events", {
  id: bigint("id", { mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  session_id: uuid("session_id").references(() => sessions.id, {
    onDelete: "cascade",
  }),
  type: text("type").notNull(),
  payload: jsonb("payload"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * kits — the generated Udaan Kit stored for analytics and future replay.
 */
export const kits = pgTable("kits", {
  id: bigint("id", { mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  session_id: uuid("session_id").references(() => sessions.id, {
    onDelete: "cascade",
  }),
  kit_json: jsonb("kit_json").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
