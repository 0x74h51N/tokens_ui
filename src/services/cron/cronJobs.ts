const cronSecret = process.env.CRON_SECRET;
const testnetAddresses = JSON.parse(process.env.TESTNET_CONTRACT_ADDRESS_LIST || "[]");
const mainnetAddresses = JSON.parse(process.env.CONTRACT_ADDRESS_LIST || "[]");
const baseUrl = process.env.VERCEL_URL || "https://tokens-ui.vercel.app";

async function fetchTransactions(contractAddress: string, testnet: boolean) {
  const url = `${baseUrl}/api/fetch-transactions?contractaddress=${contractAddress}&testnet=${testnet}&all=true&cleanCache=true`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions for ${contractAddress}`);
  }

  return await response.json();
}

export async function runCronJobs() {
  try {
    for (const address of testnetAddresses) {
      await fetchTransactions(address, true);
    }
    for (const address of mainnetAddresses) {
      await fetchTransactions(address, false);
    }

    console.log("Cron jobs completed successfully");
  } catch (error) {
    console.error("Error running cron jobs:", error);
  }
}
