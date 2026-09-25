import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { endSession, sessionOptions, type SessionData } from "@/server/auth";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(req, res, sessionOptions());
  endSession(session);
  return res;
}
