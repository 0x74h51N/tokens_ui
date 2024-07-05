import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "~~/lib/sessionOptions";

export async function POST() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  session.destroy();

  return NextResponse.json({ message: "Successfully logged out" }, { status: 200 });
}
