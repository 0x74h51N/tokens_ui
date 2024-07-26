import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { Address, isAddress, recoverMessageAddress, Signature } from "viem";
import { SessionData, sessionOptions } from "~~/lib/sessionOptions";

export async function POST(req: NextRequest) {
  console.log("Starting POST request");
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  try {
    const { address, signature }: { address: Address; signature: Signature } = await req.json();

    if (!address || !signature) {
      console.error("Address and signature are required");
      return NextResponse.json({ error: "Address and signature are required" }, { status: 400 });
    }

    if (!isAddress(address)) {
      console.error("Invalid wallet address");
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 408 });
    }

    const message = `Please sign this message for a secure connection (no gas fee) with your wallet address: ${address}`;
    const recoveredAddress = await recoverMessageAddress({ message, signature });

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
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
