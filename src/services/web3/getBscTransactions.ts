"use server";
import { Address } from "viem";
import { ExtendedTransaction } from "~~/types/utils";
import { getTransactions, setTransactions } from "../vercel-kv/getSetTransactions";
import { delay, fetchData } from "./utils";
import { kv } from "@vercel/kv";

export async function getBscTransactions(
  contractAddress: Address,
  testnet: string,
  all: string,
  offset: string,
): Promise<ExtendedTransaction[]> {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  if (all === "true") {
    try {
      const kvTransactions = await getTransactions(contractAddress, "all");
      console.log(`KV Transactions: ${kvTransactions?.length || 0}`);
      if (kvTransactions && kvTransactions.length > 0) {
        console.log("Transactions fetched from KV.");
        return kvTransactions;
      }
    } catch (error) {
      console.error("Error fetching transactions from KV:", error);
    }
  }

  const apiKey = process.env.BSC_SCAN_API_KEY;
  const domain = testnet === "true" ? "api-testnet.bscscan.com" : "api.bscscan.com";
  let transactions: ExtendedTransaction[] = [];
  if (all === "true") {
    const maxOffset = 350;
    let page = 1;
    const maxRetries = 5;

    const totalPageKey = `totalPages:${contractAddress}`;
    let totalPages = ((await kv.get(totalPageKey)) as number) || 0;

    while (true) {
      const url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=${page}&offset=${maxOffset}&sort=desc&apikey=${apiKey}`;
      let success = false;
      let retries = 0;
      while (!success && retries < maxRetries) {
        try {
          const fetchedTransactions = await fetchData(url);
          await delay(200);
          console.log(`Fetched ${fetchedTransactions.length} transactions (page: ${page}, try: ${retries + 1})`);

          if (fetchedTransactions.length === 0) {
            console.log("No transactions found, stopping fetch.");
            return transactions;
          }
          totalPages = page;
          await kv.set(totalPageKey, totalPages);
          setTransactions(contractAddress, fetchedTransactions, page);
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
      transactions = await fetchData(url);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  console.log(`Total transactions fetched: ${transactions.length}`);
  return transactions;
}
