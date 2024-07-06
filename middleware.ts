import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "~~/lib/sessionOptions";

export async function middleware(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  const authHeader = req.headers.get("Authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    return NextResponse.next();
  } else {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/fetch-transactions"],
};
