import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getIronSession } from "iron-session";
import { errorEnvelope, parseBody } from "@/server/api";
import {
  completeLogin,
  sessionOptions,
  SANDBOX_MFA_CODE,
  type SessionData,
} from "@/server/auth";

const schema = z.object({ code: z.string().length(6) });

export async function POST(req: NextRequest) {
  const body = await parseBody(req, schema);
  if (body instanceof NextResponse) return body;
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(req, res, sessionOptions());
  if (!session.userId || session.mfa !== "pending") {
    return errorEnvelope(401, "no_pending_login", "No sign-in is awaiting verification.");
  }
  if (body.code !== SANDBOX_MFA_CODE) {
    return errorEnvelope(401, "bad_code", "That code is not correct. In the sandbox, the code is 000000.");
  }
  completeLogin(session, req);
  await session.save();
  return res;
}
