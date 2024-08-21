const cronSecret = process.env.CRON_SECRET;
const vercelByPass = process.env.VERCEL_BYPASS;

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export async function fetchTransactions(contractAddress: string, testnet: boolean) {
  /**
   * This function fetch transactions for daily cron-job to cache transaction's data on server.
   * It is not fetched directly via getBscTransactions for control to and purge to cached data before fetch
   * If data cached via getBscTransactions function directly it is hard to manage cached and revalidate to data
   * */
  const url = `${baseUrl}/api/fetch-transactions?contractaddress=${contractAddress}&testnet=${testnet}&allTx=true&offset=300`;
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
  console.log(`Transactions fetched for ${contractAddress}`);
  return `Transactions fetched for ${contractAddress}`;
}
