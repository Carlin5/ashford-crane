import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/server/auth";
import { STAFF_ROLES } from "@/server/types";

/**
 * Protects /app (authenticated clients), /admin (staff roles), and /rm
 * (relationship managers and super admin).
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions());
  const { pathname } = req.nextUrl;

  const authed = Boolean(session.userId) && session.mfa === "complete";
  if (!authed) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname.startsWith("/admin") && !STAFF_ROLES.includes(session.role!)) {
    return NextResponse.redirect(new URL("/app", req.url));
  }
  if (
    pathname.startsWith("/rm") &&
    session.role !== "relationship_manager" &&
    session.role !== "super_admin"
  ) {
    return NextResponse.redirect(new URL("/app", req.url));
  }
  if (pathname.startsWith("/app") && session.role !== "client") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/rm/:path*"],
};
