import { NextRequest, NextResponse } from "next/server";
import { getBscTransactions } from "~~/utils/getBscTransactions";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const contractAddress = searchParams.get("contractaddress");
  const testnet = searchParams.get("testnet") === "true";
  if (!contractAddress) {
    return NextResponse.json({ error: "Contract address is required" }, { status: 400 });
  }
  try {
    const transactions = await getBscTransactions(contractAddress, testnet);
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
