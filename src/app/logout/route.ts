import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { endSession, sessionOptions, type SessionData } from "@/server/auth";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  const session = await getIronSession<SessionData>(req, res, sessionOptions());
  endSession(session);
  return res;
}
