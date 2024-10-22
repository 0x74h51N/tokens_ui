import { NextRequest, NextResponse } from "next/server";
import { getBscTransactions } from "~~/services/web3/getBscTransactions";

const allowedAddresses = JSON.parse(process.env.CONTRACT_ADDRESS_LIST || "[]");
const testnetAddresses = JSON.parse(process.env.TESTNET_CONTRACT_ADDRESS_LIST || "[]");

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const contractAddress = searchParams.get("contractaddress");
  const testnet = searchParams.get("testnet");
  const all = searchParams.get("allTx") || "false";
  const offset = searchParams.get("offset") || "100";
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
    const transactions = await getBscTransactions(contractAddress, testnet, all, offset);
    const response = NextResponse.json(transactions, { status: 200 });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
