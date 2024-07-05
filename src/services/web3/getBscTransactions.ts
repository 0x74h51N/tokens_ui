import { TransactionBase } from "viem";

export interface ExtendedTransaction extends TransactionBase {
  timeStamp: string;
  tokenSymbol: string;
}

async function fetchData(url: string, revalidateTime: number) {
  const response = await fetch(url, {
    next: { revalidate: revalidateTime },
  });
  const data = await response.json();
  if (data.status === "1") {
    return data.result;
  } else {
    throw new Error(data.message);
  }
}

export async function getBscTransactions(contractAddress: string, testnet: string, all: string) {
  if (!contractAddress) {
    throw new Error("Contract address is required");
  }

  const apiKey = process.env.BSC_SCAN_API_KEY;
  const domain = testnet === "true" ? "api-testnet.bscscan.com" : "api.bscscan.com";

  let url;
  let revalidateTime;
  let transactions: ExtendedTransaction[] = [];

  if (all === "true") {
    revalidateTime = 60 * 60 * 24;
    const maxOffset = 700;
    let offset = 0;

    while (true) {
      url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${maxOffset}&startblock=${offset}&sort=desc&apikey=${apiKey}`;
      const fetchedTransactions = await fetchData(url, revalidateTime);
      if (fetchedTransactions.length === 0) break;
      transactions = transactions.concat(fetchedTransactions);
      offset += maxOffset;
      if (fetchedTransactions.length < maxOffset) break;
    }
  } else {
    revalidateTime = 29;
    const offset = 50;
    url = `https://${domain}/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=${offset}&sort=desc&apikey=${apiKey}`;
    transactions = await fetchData(url, revalidateTime);
  }

  return transactions;
}
