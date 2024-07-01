import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const contractAddress = searchParams.get("contractaddress");
  const testnet = searchParams.get("testnet");
  if (!contractAddress) {
    return NextResponse.json({ error: "Contract address is required" }, { status: 400 });
  }

  const apiKey = process.env.BSC_SCAN_API_KEY;
  const offset = 250;
  const domain = testnet === "true" ? "api-testnet.bscscan.com" : "api.bscscan.com";
  const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${offset}&sort=desc&apikey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 50 } });
    const data = await response.json();
    if (data.status === "1") {
      return NextResponse.json(data.result, { status: 200 });
    } else {
      return NextResponse.json({ error: data.message }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
