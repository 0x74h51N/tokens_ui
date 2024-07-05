import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "~~/lib/sessionOptions";
import { getBscTransactions } from "~~/services/web3/getBscTransactions";

const cronSecret = process.env.CRON_SECRET;
const allowedAddresses = JSON.parse(process.env.CONTRACT_ADDRESS_LIST || "[]");
const testnetAddresses = JSON.parse(process.env.TESTNET_CONTRACT_ADDRESS_LIST || "[]");

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (authHeader === `Bearer ${cronSecret}`) {
    return handleRequest(req);
  } else {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handleRequest(req);
  }
}

async function handleRequest(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const contractAddress = searchParams.get("contractaddress");
  const testnet = searchParams.get("testnet");
  const all = searchParams.get("all") || "false";

  if (!contractAddress) {
    return NextResponse.json({ error: "Contract address is required" }, { status: 400 });
  }
  if (!testnet) {
    return NextResponse.json({ error: "Testnet parameter is required" }, { status: 400 });
  }
  const isAllowedAddress = allowedAddresses.includes(contractAddress);
  const isTestnetAddress = testnetAddresses.includes(contractAddress);

  if (!isAllowedAddress && !isTestnetAddress) {
    return NextResponse.json({ error: "Invalid contract address" }, { status: 403 });
  }

  try {
    const transactions = await getBscTransactions(contractAddress, testnet, all);
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
