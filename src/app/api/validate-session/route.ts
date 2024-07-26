import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "~~/lib/sessionOptions";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn && session.walletAddress) {
    return NextResponse.json({ isValid: true });
  } else {
    return NextResponse.json({ isValid: false });
  }
}
