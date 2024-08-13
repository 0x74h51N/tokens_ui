import scaffoldConfig from "~~/scaffold.config";
import { getTransactions, setTransactions } from "../vercel-kv/getSetTransactions";
import { kv } from "@vercel/kv";

export const cronSecret = process.env.CRON_SECRET;
export const vercelByPass = process.env.VERCEL_BYPASS;
export const testnetAddresses = scaffoldConfig.testnetContractAddressList || [];
export const mainnetAddresses = scaffoldConfig.contractAddressList || [];
export const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export async function fetchTransactions(contractAddress: string, testnet: boolean) {
  const url = `${baseUrl}/api/fetch-transactions?contractaddress=${contractAddress}&testnet=${testnet}&offset=350`;
  console.log(`Fetching transactions from URL: ${url}`);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${cronSecret}`,
  };

  if (vercelByPass) {
    headers["x-vercel-protection-bypass"] = vercelByPass;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });
  console.log(`Response status: ${response.status}`);
  if (!response.ok) {
    console.error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch transactions for ${contractAddress}`);
  }
  const transactions = await response.json();

  const totalPageKey = `totalPages:${contractAddress}`;
  const totalPage = (await kv.get(totalPageKey)) as number;

  const lastPage = await getTransactions(contractAddress, totalPage);
  const lastPageTwo = totalPage - 1 ? await getTransactions(contractAddress, totalPage - 1) : null;

  const oldTransactions = lastPageTwo ? lastPage?.concat(lastPageTwo) : lastPage;

  if (oldTransactions && lastPage) {
    const newTxs = transactions.filter(
      (newTx: { hash: string }) => !oldTransactions.some(prevTx => prevTx.hash === newTx.hash),
    );

    console.log(`Found ${newTxs.length} new transactions.`);

    if (newTxs.length > 0) {
      if (lastPage.length + newTxs.length <= 350) {
        const updatedLastPage = lastPage.concat(newTxs);
        console.log(`Updating last page with ${newTxs.length} new transactions.`);
        await setTransactions(contractAddress, updatedLastPage, totalPage);
      } else {
        const remainingTxs = 350 - lastPage.length;
        const updatedLastPage = lastPage.concat(newTxs.slice(0, remainingTxs));
        console.log(
          `Last page updated with ${remainingTxs} transactions. Remaining ${newTxs.length - remainingTxs} transactions will be stored in a new page.`,
        );
        await setTransactions(contractAddress, updatedLastPage, totalPage);

        const newPage = newTxs.slice(remainingTxs);
        console.log(`Storing ${newPage.length} transactions in new page ${totalPage + 1}.`);
        await setTransactions(contractAddress, newPage, totalPage + 1);

        await kv.set(totalPageKey, totalPage + 1);
        console.log(`Total pages updated to ${totalPage + 1}.`);
      }
    } else {
      console.log(`No new transactions found for ${contractAddress}.`);
    }
  } else {
    console.log(`Old transactions or last page is null, skipping update.`);
  }
  return;
}
