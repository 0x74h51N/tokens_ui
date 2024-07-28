const cronSecret = process.env.CRON_SECRET;
const testnetAddresses = JSON.parse(process.env.TESTNET_CONTRACT_ADDRESS_LIST || "[]");
const mainnetAddresses = JSON.parse(process.env.CONTRACT_ADDRESS_LIST || "[]");
const baseUrl = process.env.VERCEL_URL || "https://tokens-ui.vercel.app";

async function fetchTransactions(contractAddress: string, testnet: boolean) {
  const url = `${baseUrl}/api/fetch-transactions?contractaddress=${contractAddress}&testnet=${testnet === true ? "true" : "false"}&allTx=true&cleanCache=true`;
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
  for (const address of testnetAddresses) {
    try {
      await fetchTransactions(address, true);
      console.log(`Successfully fetched transactions for testnet address: ${address}`);
    } catch (error) {
      console.error(`Error fetching transactions for testnet address ${address}:`, error);
    }
  }

  for (const address of mainnetAddresses) {
    try {
      await fetchTransactions(address, false);
      console.log(`Successfully fetched transactions for mainnet address: ${address}`);
    } catch (error) {
      console.error(`Error fetching transactions for mainnet address ${address}:`, error);
    }
  }

  console.log("Cron jobs completed with some possible errors");
}
