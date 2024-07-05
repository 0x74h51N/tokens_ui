import { TransactionBase } from "viem";

export interface ExtendedTransaction extends TransactionBase {
  timeStamp: string;
  tokenSymbol: string;
}

export async function getBscTransactions(contractAddress: string, testnet: string, all: string) {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  const apiKey = process.env.BSC_SCAN_API_KEY;
  const domain = testnet === "true" ? "api-testnet.bscscan.com" : "api.bscscan.com";
  const offset = 50;

  let url;
  let revalidateTime;

  if (all === "true") {
    url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&sort=desc&apikey=${apiKey}`;
    revalidateTime = 60 * 60 * 24;
  } else {
    url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${offset}&sort=desc&apikey=${apiKey}`;
    revalidateTime = 29;
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: revalidateTime },
    });
    const data = await response.json();
    if (data.status === "1") {
      return data.result;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error("Error fetching data: " + error);
  }
}
