import "server-only";
import { Pool, types } from "pg";

/**
 * Self-hosted Postgres pool (replaces Supabase).
 * Connects to the VPS `constellation` database, `habitat3ri` schema.
 * DATABASE_URL = postgresql://habitat3ri_user:***@postgres:5432/constellation
 *
 * If DATABASE_URL is unset (e.g. local dev without DB), getPool() returns null
 * and callers fall back to the bundled sample articles.
 */

// Return timestamptz/timestamp as ISO strings so rows match the string-typed
// domain models (Article.published_at, etc.) and serialize cleanly to clients.
types.setTypeParser(1184, (v) => (v ? new Date(v).toISOString() : null)); // timestamptz
types.setTypeParser(1114, (v) => (v ? new Date(v + "Z").toISOString() : null)); // timestamp

let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    // Resolve unqualified table names against the habitat3ri schema.
    options: "-c search_path=habitat3ri,public",
  });
  pool.on("error", (err) => console.error("[db] idle client error:", err.message));
  return pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const p = getPool();
  if (!p) return [];
  try {
    const res = await p.query(text, params as unknown[]);
    return res.rows as T[];
  } catch (err) {
    console.error("[db] query failed:", (err as Error).message);
    return [];
  }
}
