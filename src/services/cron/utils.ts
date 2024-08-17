"use server";
import { getTransactions, setTransactions } from "../vercel-kv/getSetTransactions";
import { kv } from "@vercel/kv";
import { getBscTransactions } from "../web3/getBscTransactions";

export async function fetchTransactions(contractAddress: string, testnet: string) {
  const transactions = await getBscTransactions(contractAddress, testnet, "false", "350");

  const totalPageKey = `totalPages:${contractAddress}`;
  const totalPage = (await kv.get(totalPageKey)) as number;
  const lastPage = await getTransactions(contractAddress, totalPage);
  const lastPageTwo = totalPage > 1 ? await getTransactions(contractAddress, totalPage - 1) : null;

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
        return `Updated with ${newTxs.length} new transactions.`;
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
        return `Updated with ${newTxs.length} with new page.`;
      }
    } else {
      return `No new transactions found.`;
    }
  } else {
    return `Old transactions or last page is null, skipping update.`;
  }
}
