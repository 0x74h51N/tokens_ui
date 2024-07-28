"use server";
import scaffoldConfig from "~~/scaffold.config";

const cronSecret = process.env.CRON_SECRET;
const testnetAddresses = scaffoldConfig.testnetContractAddressList || "[]";
const mainnetAddresses = scaffoldConfig.contractAddressList || "[]";
const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://tokens-ui.vercel.app";
async function fetchTransactions(contractAddress: string, testnet: boolean) {
  const url = `${baseUrl}/api/fetch-transactions?contractaddress=${contractAddress}&testnet=${testnet}&allTx=true&cleanCache=true`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions for ${contractAddress}`);
  }

  const data = await response.json();
  return data.message;
}

export async function runCronJobs() {
  let resultMessage = "Cron jobs completed with the following results:\n";

  for (const address of testnetAddresses) {
    try {
      const message = await fetchTransactions(address, true);
      console.log(`Successfully fetched transactions for testnet address: ${address}`);
      resultMessage += `Testnet address ${address}: ${message}\n`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching transactions for testnet address ${address}:`, error);
        resultMessage += `Testnet address ${address}: ${error.message}\n`;
      }
    }
  }

  for (const address of mainnetAddresses) {
    try {
      const message = await fetchTransactions(address, false);
      console.log(`Successfully fetched transactions for mainnet address: ${address}`);
      resultMessage += `Mainnet address ${address}: ${message}\n`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching transactions for mainnet address ${address}:`, error);
        resultMessage += `Mainnet address ${address}: ${error.message}\n`;
      }
    }
  }

  return resultMessage;
}
