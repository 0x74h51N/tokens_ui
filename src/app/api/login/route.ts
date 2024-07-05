import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { isAddress } from "viem";
import { SessionData, sessionOptions } from "~~/lib/sessionOptions";

export async function POST(req: NextRequest) {
  console.log("Starting POST request");
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  try {
    const { address } = await req.json();
    console.log("Received address:", address);

    if (!address) {
      console.error("Wallet address is required");
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    if (!isAddress(address)) {
      console.error("Invalid wallet address");
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    session.isLoggedIn = true;
    session.walletAddress = address;
    await session.save();
    console.log("Session saved successfully");
    return NextResponse.json({ message: "Successfully logged in" }, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
  }
}
