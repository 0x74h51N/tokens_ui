import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "~~/lib/sessionOptions";

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  session.isLoggedIn = false;
  session.walletAddress = "";
  await session.save();

  return NextResponse.json({ message: "Successfully logged out" }, { status: 200 });
}
