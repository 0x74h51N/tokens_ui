import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./lib/sessionOptions";
import { cookies } from "next/headers";
import { getSession } from "@auth0/nextjs-auth0/edge";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  const cronSecret = process.env.CRON_SECRET;
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  const auth0Session = await getSession(req, res);
  const isLoggedIn = session.isLoggedIn || auth0Session?.user;

  if (pathname.startsWith("/api/cron-jobs")) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader === `Bearer ${cronSecret}`) {
      console.log("Authorization successful for cron job");
      return res;
    }
  }

  if (isLoggedIn && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/api/auth")) {
    return res;
  }
  if (!isLoggedIn && !pathname.startsWith("/login") && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)", "/api/:path*"],
};
