"use server";
import { Address } from "viem";
import { ExtendedTransaction } from "~~/types/utils";

async function fetchData(url: string, revalidateTime?: number): Promise<ExtendedTransaction[]> {
  const response = await fetch(
    url,
    revalidateTime
      ? {
          next: { revalidate: revalidateTime },
        }
      : {
          method: "GET",
          cache: "no-store",
        },
  );
  const data = await response.json();

  if (data.status === "1") {
    return data.result as ExtendedTransaction[];
  } else {
    throw new Error(data.message || "Failed to fetch data");
  }
}
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function getBscTransactions(
  contractAddress: Address,
  testnet: string,
  all: string,
): Promise<ExtendedTransaction[]> {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  const apiKey = process.env.BSC_SCAN_API_KEY;
  const domain = testnet === "true" ? "api-testnet.bscscan.com" : "api.bscscan.com";
  let transactions: ExtendedTransaction[] = [];
  if (all === "true") {
    const maxOffset = 350;
    const revalidateTime = 180;
    let page = 1;
    const maxRetries = 5;

    while (true) {
      const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=${page}&offset=${maxOffset}&sort=desc&apikey=${apiKey}`;
      let success = false;
      let retries = 0;
      while (!success && retries < maxRetries) {
        try {
          const fetchedTransactions = await fetchData(url, revalidateTime);
          await delay(200);
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
    try {
      transactions = await fetchData(url);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  console.log(`Total transactions fetched: ${transactions.length}`);
  return transactions;
}
