import { createHash } from "crypto";
import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getStore, nextId } from "./store";
import { ensureSeed } from "./store/seed";
import { notify } from "./domain/notifications";
import type { Role } from "./types";

export type SessionData = {
  userId?: string;
  email?: string;
  name?: string;
  role?: Role;
  customerId?: string;
  mfa?: "pending" | "complete";
  sessionId?: string;
};

export const SESSION_COOKIE = "ac_session";
export const SANDBOX_MFA_CODE = "000000";

export function sessionOptions(): SessionOptions {
  let password = process.env.SESSION_SECRET;
  if (!password) {
    console.warn(
      "[ashford-crane] SESSION_SECRET is not set — using the built-in development default. Do not use this outside the sandbox.",
    );
    password = "ashford-crane-dev-only-secret-change-me";
  }
  return {
    cookieName: SESSION_COOKIE,
    password,
    ttl: 60 * 60 * 8,
    cookieOptions: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" },
  };
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions());
}

export function hashPassword(pw: string): string {
  return createHash("sha256").update(`ac-sandbox:${pw}`).digest("hex");
}

/** Verify credentials; on success returns the user, else null. */
export function verifyLogin(email: string, password: string) {
  const store = getStore();
  ensureSeed(store);
  const user = store.users.get(email.toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) return null;
  return user;
}

/** After MFA completes: record a session + device and mark the session. */
export function completeLogin(
  session: IronSession<SessionData>,
  req?: NextRequest,
): void {
  const store = getStore();
  ensureSeed(store);
  const sid = nextId(store, "ses");
  const ua = req?.headers.get("user-agent") ?? "Unknown device";
  const label = ua.length > 60 ? ua.slice(0, 60) : ua;
  store.sessions.set(sid, {
    id: sid,
    userId: session.userId!,
    deviceLabel: label,
    ip: req?.headers.get("x-forwarded-for") ?? "127.0.0.1",
    createdAt: Date.now(),
    current: true,
  });
  store.devices.set(`dev_${sid}`, {
    id: `dev_${sid}`,
    userId: session.userId!,
    label,
    lastSeenAt: Date.now(),
  });
  const isNewDevice = ![...store.devices.values()].some(
    (d) => d.userId === session.userId && d.label === label && d.id !== `dev_${sid}`,
  );
  notify(store, {
    userId: session.userId!,
    kind: "login",
    text: isNewDevice
      ? `Signed in from a new device — ${label}.`
      : `Signed in — ${label}.`,
  });
  session.mfa = "complete";
  session.sessionId = sid;
}

export function endSession(session: IronSession<SessionData>): void {
  const store = getStore();
  if (session.sessionId) store.sessions.delete(session.sessionId);
  session.destroy();
}
