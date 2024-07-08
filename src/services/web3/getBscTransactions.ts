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
    const maxOffset = 600;
    const revalidateTime = 60 * 60 * 24;
    let page = 1;
    const maxRetries = 5;

    while (true) {
      const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=${page}&offset=${maxOffset}&sort=desc&apikey=${apiKey}`;

      if (cleanCache === "true") {
        await revalidatePaths(url);
      }

      let success = false;
      let retries = 0;
      while (!success && retries < maxRetries) {
        try {
          const fetchedTransactions = await fetchData(url, revalidateTime);
          console.log(`Fetched ${fetchedTransactions.length} transactions (page: ${page}, try: ${retries + 1})`);

          if (fetchedTransactions.length === 0) {
            console.log("No transactions found, stopping fetch.");
            return transactions;
          }
          transactions = transactions.concat(fetchedTransactions);
          page++;
          success = true;

          if (fetchedTransactions.length < maxOffset) break;
        } catch (error) {
          retries++;
          console.error(`Error fetching transactions at page ${page}, retry ${retries}:`, error);
          if (error instanceof Error && error.message.includes("No transactions found")) {
            console.log("No transactions found, stopping fetch.");
            return transactions;
          }
        }
      }

      if (!success) {
        console.error(`Failed to fetch transactions after ${maxRetries} retries at page ${page}`);
        break;
      }
    }
  } else {
    const offset = 100;
    const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${offset}&sort=desc&apikey=${apiKey}`;
    const revalidateTime = 29;

    if (cleanCache === "true") {
      await revalidatePaths(url);
    }

    try {
      transactions = await fetchData(url, revalidateTime);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  console.log(`Total transactions fetched: ${transactions.length}`);
  return transactions;
}

async function revalidatePaths(path: string) {
  try {
    await revalidatePath(path);
  } catch (error) {
    console.error("Error revalidating path:", error);
    throw error;
  }
}
