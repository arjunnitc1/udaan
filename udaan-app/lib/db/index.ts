import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Lazy singleton database client for Next.js.
 *
 * The client is only created on the first actual request, not at module
 * import time. This lets `next build` succeed without DATABASE_URL being
 * present in the build environment (only needed at runtime).
 *
 * In development, the singleton is cached on `globalThis` to survive
 * hot-module reloads and avoid exhausting the Postgres connection pool.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { var __db: any; }

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let _db: DrizzleDb | null = null;

function createDb(): DrizzleDb {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (see .env.example)."
    );
  }

  const client = postgres(connectionString, {
    // Supabase session-mode pooler: 1 connection per serverless function.
    max: 1,
    // Disable prefetch — not supported by the serverless/pooler driver.
    prepare: false,
  });

  return drizzle(client, { schema });
}

/**
 * Returns the Drizzle DB instance.
 * Call this inside your route handler, not at module scope.
 */
export function getDb(): DrizzleDb {
  if (process.env.NODE_ENV !== "production") {
    if (!globalThis.__db) globalThis.__db = createDb();
    return globalThis.__db as DrizzleDb;
  }
  if (!_db) _db = createDb();
  return _db;
}

// Convenience re-export so callers can do: import { db } from "@/lib/db"
// and use it as a getter.  Note: this is a getter, so DATABASE_URL must
// exist at the time this property is first accessed (i.e. inside a request).
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    return getDb()[prop as keyof DrizzleDb];
  },
});
