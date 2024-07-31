import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./lib/sessionOptions";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  const cronSecret = process.env.CRON_SECRET;
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!session.isLoggedIn && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const authHeader = req.headers.get("Authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    console.log("Authorization successful");
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)", "/api/:path*"],
};
