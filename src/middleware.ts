import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./lib/sessionOptions";
import { cookies } from "next/headers";

const publicPaths = ["/api/login", "/api/validate-session", "/api/logout", "/login"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  const cronSecret = process.env.CRON_SECRET;

  if (publicPaths.includes(pathname)) {
    return res;
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    console.log("Authorization successful");
    return res;
  }

  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api/login|api/validate-session|api/logout|_next/static|_next/image|favicon.ico|logo.png|.*\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
  ],
};
