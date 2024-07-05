import { revalidatePath } from "next/cache";
import { TransactionBase } from "viem";

export interface ExtendedTransaction extends TransactionBase {
  timeStamp: string;
  tokenSymbol: string;
}

async function fetchData(url: string, revalidateTime: number): Promise<ExtendedTransaction[]> {
  const response = await fetch(url, {
    next: { revalidate: revalidateTime },
  });
  const data = await response.json();
  if (data.status === "1") {
    return data.result as ExtendedTransaction[];
  } else {
    throw new Error(data.message || "Failed to fetch data");
  }
}

export async function getBscTransactions(
  contractAddress: string,
  testnet: string,
  all: string,
  cleanCache: string,
): Promise<ExtendedTransaction[]> {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  const apiKey = process.env.BSC_SCAN_API_KEY;
  const domain = testnet === "true" ? "api-testnet.bscscan.com" : "api.bscscan.com";
  let transactions: ExtendedTransaction[] = [];

  if (all === "true") {
    const maxOffset = 700;
    const revalidateTime = 60 * 60 * 24;
    let page = 1;

    while (true) {
      const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=${page}&offset=${maxOffset}&sort=desc&apikey=${apiKey}`;
      if (cleanCache === "true") {
        await revalidatePaths(url);
      }
      const fetchedTransactions = await fetchData(url, revalidateTime);
      if (fetchedTransactions.length === 0) break;
      transactions = transactions.concat(fetchedTransactions);
      page++;
      if (fetchedTransactions.length < maxOffset) break;
    }
  } else {
    const offset = 50;
    const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${offset}&sort=desc&apikey=${apiKey}`;
    const revalidateTime = 29;
    if (cleanCache === "true") {
      await revalidatePaths(url);
    }
    transactions = await fetchData(url, revalidateTime);
  }

  return transactions;
}

async function revalidatePaths(path: string) {
  revalidatePath(path);
}
