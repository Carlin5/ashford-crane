import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getIronSession } from "iron-session";
import { getStore } from "./store";
import { ensureSeed } from "./store/seed";
import { sessionOptions, type SessionData } from "./auth";
import type { Role } from "./types";

export function errorEnvelope(
  status: number,
  code: string,
  message: string,
): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status });
}

export type ApiSession = SessionData & {
  userId: string;
  role: Role;
  mfa: "complete";
};

export async function readSession(req: NextRequest): Promise<SessionData> {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions());
  return session;
}

/** 401 unless a fully authenticated session exists (or valid sandbox key). */
export async function requireSession(
  req: NextRequest,
): Promise<ApiSession | NextResponse> {
  const sandboxKey = req.headers.get("x-sandbox-key");
  if (sandboxKey?.startsWith("sandbox_")) {
    const store = getStore();
    ensureSeed(store);
    const user = [...store.users.values()].find((u) => u.role === "client")!;
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      customerId: user.customerId,
      mfa: "complete",
    };
  }
  const session = await readSession(req);
  if (!session.userId || session.mfa !== "complete") {
    return errorEnvelope(401, "unauthenticated", "Sign in required.");
  }
  return session as ApiSession;
}

export function requireRole(
  session: ApiSession | NextResponse,
  roles: Role[],
): NextResponse | null {
  if (session instanceof NextResponse) return session;
  if (!roles.includes(session.role)) {
    return errorEnvelope(403, "forbidden", "Your role cannot perform this action.");
  }
  return null;
}

// --- Simple in-memory token-bucket rate limiter ---
const buckets = new Map<string, { tokens: number; at: number }>();
const RATE = { capacity: 60, refillPerSec: 1 };

export function rateLimit(key: string): NextResponse | null {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: RATE.capacity, at: now };
  b.tokens = Math.min(RATE.capacity, b.tokens + ((now - b.at) / 1000) * RATE.refillPerSec);
  b.at = now;
  if (b.tokens < 1) {
    return errorEnvelope(429, "rate_limited", "Too many requests — try again shortly.");
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return null;
}

/** Parse + validate a JSON body against a zod schema. */
export async function parseBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<z.infer<T> | NextResponse> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return errorEnvelope(400, "bad_json", "Request body must be valid JSON.");
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return errorEnvelope(400, "validation", "Request failed validation.");
  }
  return parsed.data;
}

/**
 * Idempotency-Key handling for financial writes: the first response for a
 * key is stored per user and replayed verbatim for retries.
 */
export async function withIdempotency(
  req: NextRequest,
  userId: string,
  run: () => Promise<{ status: number; body: unknown }>,
): Promise<NextResponse> {
  const key = req.headers.get("idempotency-key");
  if (!key) {
    return errorEnvelope(400, "idempotency_key_required", "Idempotency-Key header is required on this endpoint.");
  }
  const store = getStore();
  const fullKey = `${userId}:${key}`;
  const existing = store.idempotency.get(fullKey);
  if (existing) {
    return NextResponse.json(existing.body, {
      status: existing.status,
      headers: { "x-idempotent-replay": "true" },
    });
  }
  const result = await run();
  store.idempotency.set(fullKey, {
    key: fullKey,
    userId,
    status: result.status,
    body: result.body,
  });
  return NextResponse.json(result.body, { status: result.status });
}
