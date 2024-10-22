const cronSecret = process.env.CRON_SECRET;
const vercelByPass = process.env.VERCEL_BYPASS;

const baseDomain = process.env.DOMAIN;
const baseUrl = process.env.NODE_ENV === "production" ? `https://${baseDomain}` : "http://localhost:3000";

export async function fetchTransactions(contractAddress: string, testnet: boolean) {
  /**
   * This function fetches transactions for the daily cron-job to cache transaction data on the server.
   * Transactions are not fetched directly via the getBscTransactions function to allow better control
   * and purging of cached data before fetching.
   * If data were cached directly via the getBscTransactions function, it is not possible to revalidate the cached data.
   * At least I couldn't manage it...
   */
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
