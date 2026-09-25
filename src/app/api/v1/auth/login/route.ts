import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getIronSession } from "iron-session";
import { errorEnvelope, parseBody, rateLimit } from "@/server/api";
import { sessionOptions, verifyLogin, type SessionData } from "@/server/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const limited = rateLimit(`login:${req.headers.get("x-forwarded-for") ?? "local"}`);
  if (limited) return limited;
  const body = await parseBody(req, schema);
  if (body instanceof NextResponse) return body;
  const user = verifyLogin(body.email, body.password);
  if (!user) {
    return errorEnvelope(401, "invalid_credentials", "Email or password is incorrect.");
  }
  const res = NextResponse.json({ mfaRequired: true });
  const session = await getIronSession<SessionData>(req, res, sessionOptions());
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  session.role = user.role;
  session.customerId = user.customerId;
  session.mfa = "pending";
  await session.save();
  return res;
}
