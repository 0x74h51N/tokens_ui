"use server";
import { Address } from "viem";
import { ExtendedTransaction } from "~~/types/utils";
import { delay, fetchData } from "./utils";
import scaffoldConfig from "~~/scaffold.config";

/**
 * Fetches transaction data from the Binance Smart Chain (BSC) using the BSC Scan API.
 * This function can fetch transactions either from the testnet or mainnet, and can fetch all transactions or a subset.
 *
 * @param contractAddress - The contract address for which to fetch transactions.
 * @param testnet - A string indicating whether to fetch from the testnet ("true") or mainnet ("false").
 * @param all - A string indicating whether to fetch all transactions ("true") or a subset ("false").
 * @param offset - The number of transactions to fetch per page (used for pagination).
 *
 * @returns {Promise<ExtendedTransaction[]>} - Returns a promise that resolves to an array of ExtendedTransaction objects.
 */
export async function getBscTransactions(
  contractAddress: Address,
  testnet: string,
  all: string,
  offset: string,
): Promise<ExtendedTransaction[]> {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  const apiKey = process.env.BSC_SCAN_API_KEY;
  const domain = testnet === "true" ? "api-testnet.bscscan.com" : "api.bscscan.com";
  let transactions: ExtendedTransaction[] = [];
  if (all === "true") {
    const maxOffset = Number(offset);
    let page = 1;
    const maxRetries = 5;

    while (true) {
      const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=${page}&offset=${maxOffset}&sort=desc&apikey=${apiKey}`;
      let success = false;
      let retries = 0;
      while (!success && retries < maxRetries) {
        try {
          const fetchedTransactions = await fetchData(url, 86398);
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
    const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${offset}&sort=desc&apikey=${apiKey}`;
    try {
      const revalidate = scaffoldConfig.pollingInterval / 1000;
      transactions = await fetchData(url, revalidate - 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  console.log(`Total transactions fetched: ${transactions.length}`);
  return transactions;
}
