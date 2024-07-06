import { NextRequest, NextResponse } from "next/server";
import { CoinData, getCoinGeckoData } from "~~/services/web3/getCoinGeckoData";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tokenName = searchParams.get("tokenName");
  const currency = searchParams.get("currency");

  try {
    if (!tokenName || !currency) {
      throw new Error("Invalid query parameters");
    }
    const data: CoinData | null = await getCoinGeckoData(tokenName, currency);
    if (!data) {
      throw new Error("Data fetch error");
    } else return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
