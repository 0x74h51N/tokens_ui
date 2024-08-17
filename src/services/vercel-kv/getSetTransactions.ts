"use server";
import { kv } from "@vercel/kv";
import { Address } from "viem";
import { ExtendedTransaction } from "~~/types/utils";

export async function setTransactions(contractAddress: Address, transactions: ExtendedTransaction[], page: number) {
  const pageKey = `${contractAddress}:page:${page}`;
  await kv.set<ExtendedTransaction[]>(pageKey, transactions);
  console.log(`Stored ${transactions.length} transactions for ${contractAddress} on page ${page}`);
}

export async function getTransactions(
  contractAddress: Address,
  page: number | "all",
): Promise<ExtendedTransaction[] | null> {
  if (page === "all") {
    const allTransactions: ExtendedTransaction[] = [];
    let pageIndex = 1;
    while (true) {
      const pageKey = `${contractAddress}:page:${pageIndex}`;
      const pageData = await kv.get<ExtendedTransaction[]>(pageKey);

      if (!pageData) {
        console.log(`No data found for ${pageKey}. Ending loop.`);
        break;
      }

      allTransactions.push(...pageData);
      console.log(`Fetched ${pageData.length} transactions from ${pageKey}.`);
      pageIndex++;
    }

    return allTransactions.length > 0 ? allTransactions : null;
  } else {
    const pageKey = `${contractAddress}:page:${page}`;
    const pageData = await kv.get<ExtendedTransaction[]>(pageKey);

    if (!pageData) {
      console.log(`No data found for ${pageKey}.`);
      return null;
    }

    console.log(`Fetched ${pageData.length} transactions from ${pageKey}.`);
    return pageData;
  }
}
